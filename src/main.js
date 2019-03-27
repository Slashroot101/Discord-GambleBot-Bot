const fs = require('fs');
const Discord = require('discord.js');
const moment = require('moment');
const NATS = require('nats');
const ROLES = require('./utility/constants/roles');
const { lotteryWinnerEmbed } = require('./utility/lottery/lotteryWinnerEmbed');
const { pickFirstChannelInGuild } = require('./utility/pickFirstChannelInGuild');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const { prefix, botToken, natsUrl } = require('../config');

const commandDirectories = fs.readdirSync('./commands');
const commandAPI = require('./api/commands');
const pointsAPI = require('./api/points');
const guildAPI = require('./api/guild');
const lotteryAPI = require('./api/lottery');
const { getUserByDiscordID, create } = require('./api/user');
const getHumanizedDuration = require('./utility/getHumanizedDuration');

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  for (const directory of commandDirectories) {
    const files = fs.readdirSync(`./commands/${directory}`);
    files.forEach(async (file) => {
      const command = require(`./commands/${directory}/${file}`);
      const newCommand = await commandAPI.create(command);
      command.id = newCommand.commands.id;
      command.maintenanceMode = newCommand.commands.maintenance;
      client.commands.set(command.name, command);
    });
  }

  const nats = await NATS.connect({ url: natsUrl });

  nats.subscribe('lottery', async (msg) => {
    const parsedMessage = JSON.parse(msg);
    const winner = await lotteryAPI.completeLottery(parsedMessage.id);
    const channel = winner.channel ? client.channels.get(winner.channel['discord_channel_id']) : pickFirstChannelInGuild(client.channels);
    channel.send({ embed: lotteryWinnerEmbed(winner.user['discord_user_id'], winner.jackpotTotal.jackpot) });
  });
});

client.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot || msg.guild === null) return undefined;
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift();
  try {
	  const commandToExec = client.commands.get(command);
    if (!commandToExec) return undefined;
	  await guildAPI.create([msg.guild.id]);
    let user = await getUserByDiscordID(msg.author.id);

    if (commandToExec.maintenanceMode === true && user.rolename !== ROLES.ADMIN.name) {
      return msg.reply(' this command is currently in maintenance mode. Please try again later.');
    }

    if (user.length === 0) {
      user = await create(msg.author.id);
    }

    if (user.blacklist_date !== null && user.length !== 0) {
      return msg.reply(`you were blacklisted on ${moment(user.blacklist_date)}. Please contact an administrator if you think this is incorrect.`);
    }

    if (commandToExec.requiresAdmin && user.rolename !== ROLES.ADMIN.name) {
      return msg.reply('nice try :-). You must be an admin to run that command.');
    }

    if (commandToExec.hasCooldown && user.roleName !== ROLES.ADMIN.name) {
      const isOnCooldown = await commandAPI.isCommandOnCooldown(commandToExec.id, user.user_id);
      if (isOnCooldown.onCooldown) {
        const availableTime = moment(isOnCooldown.oldestAudit.execution_time).add(isOnCooldown.oldestAudit.duration, 'minutes');
        return msg.reply(` that command is currently on cooldown and will be available ${getHumanizedDuration(isOnCooldown.oldestAudit.current_time, availableTime, true)}.`);
      }
    }

    const [reward, audit] = await Promise.all([
      commandToExec.execute(client, msg, args, user),
      commandAPI.addToUserAudit(commandToExec.id, user.user_id),
    ]);

    if (commandToExec.generatesMoney && reward !== undefined && reward !== 0) {
      await Promise.all([
        pointsAPI.addPointsByUserID(user.user_id, msg.guild.id, reward),
        pointsAPI.addPointsToUserAudit(audit.audit.id, reward),
      ]);
    }
  } catch (error) {
    console.log(error)
    msg.reply('there was an error trying to execute that command!');
  }
  return undefined;
});

client.on('guildCreate', async (event) => {
  await guildAPI.create([event.id]);
});

client.login(botToken);
