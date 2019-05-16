const Discord = require('discord.js');
const moment = require('moment');
const client = new Discord.Client();
const {botToken} = require('../config');
const NATS = require('nats');
const config = require('../config');
const User = require('../src/api/user');
const Role = require('../src/api/role');
const createCommands = require('./utility/createCommands');
const createGuildsAndGetPrefix = require('./utility/createGuildsAndGetPrefix');
const handleExpiredLotteries = require('./utility/handleLotteryExpiration');
const Guild = require('../src/api/guild');
const {getCommandHistoryWithFilter, createCommandHistory} = require('../src/api/commandHistory');
const getHumanizedDuration = require('../src/utility/getHumanizedDuration');
client.commands = new Discord.Collection();

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	await client.user.setActivity(`Type @${client.user.username} to get prefix.`);
	[client.commands, client.prefix] = await Promise.all([
		createCommands(),
		createGuildsAndGetPrefix([ ...client.guilds.keys()]),
	]);

	const nats = await NATS.connect({ url: config.natsUrl });

	nats.subscribe('lottery', (message) => {
		handleExpiredLotteries(message, client);
	});
});

client.on('message', async (msg) => {
	try {
		if(msg.author.bot || msg.guild === null) return;
		if(msg.content.startsWith(`<@!${client.user.id}>`)){
		  return msg.reply(`prefix for this guild: ${client.prefix.get(msg.guild.id)}`);
    }
		const prefix = client.prefix.get(msg.guild.id);
		if (!msg.content.startsWith(prefix)) return;
		const args = msg.content.slice(prefix.length).split(/ +/);
		const command = args.shift();
		const commandToExec = client.commands.get(command);
		if (!commandToExec) return;
		let user = await User.getWithFilter({discordUserID: msg.author.id});
		if(!user.length){
			const role = await Role.getWithFilter({name: 'baseUser'});
			user = await User.createUser(msg.author.id, role[0]._id);
		} else {
			user = user[0];
		}

		if(commandToExec.isInMaintenanceMode){
			return msg.reply(' this command is currently in maintenance mode. Please try again later.');
		}

		if(commandToExec.allowedRoles.length !== 0 && !commandToExec.allowedRoles.includes(user.role)){
			return msg.reply(' you need a different role to execute that command.');
		}

		if(user.blacklist.isBlacklisted){
			return msg.reply(` you are currently blacklisted. You were blacklisted on ${user.blacklist.blacklistDate}. Please contact an admin if you think this is wrong.`);
		}

		if(commandToExec.cooldown.hasCooldown){
			const commandAudit = await getCommandHistoryWithFilter({userID: user._id, startTime: moment().subtract(commandToExec.cooldown.cooldownInMinutes, 'minutes').toDate(), endTime: moment().toDate(), sort: -1, commandID: commandToExec._id });
			if(commandAudit.length >= commandToExec.cooldown.executions){
				const availableTime = moment(commandAudit[0].executionTime).add(commandToExec.cooldown.cooldownInMinutes, 'minutes');
				return msg.reply(`This command is on cooldown and will currently be available ${getHumanizedDuration(moment(), availableTime, true)}`)
			}
		}

		let guild = await Guild.getGuildWithFilter({discordGuildID: [msg.guild.id]});
		if(guild[0].disabledCommands.includes(commandToExec._id)){
			return msg.reply(' this command is currently disabled in this guild. Check with your guild admin if you think that this is wrong.');
		}

		const commandValue = await commandToExec.execute(client, msg, args, user, guild[0]);

		if(commandToExec.costData.hasCost && typeof commandValue === 'number'){
			let totalPointsForUser = commandValue;
			if(commandValue > 0){
				const globalGuild = await Guild.getGuildWithFilter({isGlobal: true});
				const guildTaxAmount = (commandValue - globalTaxAmount) * config.tax.guild;
				totalPointsForUser -= guildTaxAmount;
				await Guild.updateGuild(guild[0]._id, {points: commandValue});
				if(globalGuild.length > 0){
					totalPointsForUser -= globalTaxAmount;
					const globalTaxAmount = commandValue * config.tax.global
					await Guild.updateGuild(globalGuild[0]._id, )
				}
			}
			await User.addPointsToUser(user._id, commandToExec._id, totalPointsForUser);
		}

		if(typeof commandValue === 'number' && commandValue !== 0){
			await createCommandHistory({
				commandID: commandToExec._id,
				executionTime: moment(),
				userID: user._id,
				points: commandValue,
			});
		}
	} catch (err) {
		console.log(err)
		msg.reply(' there was an error executing that command.');
	}
});

client.on('guildCreate', async (event) => {
	const guild = await Guild.getGuildWithFilter({discordGuildID: [event.id]});
	if(!guild.length){
		await Guild.create({
			discordGuildID: event.id,
			bank: {
				currentBalance: 0,
				totalPointsGained: 0
			},
			prefix: config.prefix,
			isGlobal: false,
			createdOn: new Date(),
			communicationChannel: {
				onlyAllowCommunicationsHere: false,
				discordChannelID: ''
			}
		});
	}

});

client.login(botToken);
