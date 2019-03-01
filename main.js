const fs = require('fs');
const Discord = require('discord.js');
const moment = require('moment');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const { prefix, botToken } = require('./config');


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandAPI = require('./api/commands');
const pointsAPI = require('./api/points');
const guildAPI = require('./api/guild');
const { getUserByDiscordID, create } = require('./api/user');

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    const newCommand = await commandAPI.create(command);
    command.id = newCommand.commands.id;
    client.commands.set(command.name, command);
  }
});

client.on('message', async (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot || msg.guild === null) return undefined;

  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  try {
    if (!client.commands.has(command)) return undefined;
    let user = await getUserByDiscordID(msg.author.id);

    if (user.length === 0) {
      user = await create(msg.author.id);
    }

    if (user.blacklist_date !== null && user.length !== 0) {
      return msg.reply(`you were blacklisted on ${moment(user.blacklist_date)}. Please contact an administrator if you think this is incorrect.`);
    }

    const commandToExec = client.commands.get(command);

    if (commandToExec.requiresAdmin && user.roleName !== 'admin') {
      return msg.reply('nice try :-). You must be an admin to run that command.');
    }

    if (commandToExec.hasCooldown && user.roleName !== 'admin') {
      const isOnCooldown = await commandAPI.isCommandOnCooldown(commandToExec.id, user.user_id);
      if (isOnCooldown.onCooldown) {
        const availableTime = moment(isOnCooldown.oldestAudit.execution_time).add(isOnCooldown.oldestAudit.duration, 'minutes');
        const timeDifference = availableTime.diff(moment(isOnCooldown.oldestAudit.current_time));
        const duration = moment.duration(timeDifference);
        return msg.reply(` that command is currently on cooldown and will be available ${duration.humanize(true)}.`);
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
    msg.reply('there was an error trying to execute that command!');
  }
  return undefined;
});

client.on('guildCreate', async (event) => {
  await guildAPI.create(event.id);
});

client.login(botToken);
