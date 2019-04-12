
const Discord = require('discord.js');
const moment = require('moment');
const client = new Discord.Client();
const {prefix, botToken} = require('../config');
const fs = require('fs');
const config = require('../config');
const User = require('../src/api/user');
const Role = require('../src/api/role');
const Command = require('../src/api/command');
const Guild = require('../src/api/guild');
const {getCommandHistoryWithFilter, createCommandHistory} = require('../src/api/commandHistory');
const getHumanizedDuration = require('../src/utility/getHumanizedDuration');
client.commands = new Discord.Collection();

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const commandDirectories = fs.readdirSync('./commands');
	const allCommands = await Command.getWithFilter();
	for (const directory of commandDirectories) {
		const files = fs.readdirSync(`./commands/${directory}`);
		files.forEach(async (file) => {
			const command = require(`./commands/${directory}/${file}`);
			let foundCommand = allCommands.filter(x => x.name === command.name);
			if(!foundCommand.length){
				foundCommand = await Command.createCommand(command);
			}
			command.id = foundCommand._id;
			client.commands.set(command.name, command);
		});
	}
	const guildsIds = [ ...client.guilds.keys() ];
	const guilds = await Guild.getGuildWithFilter({discordGuildID: guildsIds});
	const savedGuildIDs = guilds.map(x => x.discordGuildID);
	const notSavedGuilds = guildsIds.filter(x => x.includes(savedGuildIDs));
	const guildPromises = [];
	for(let i = 0; i < notSavedGuilds.length; i++){
		guildPromises.push(Guild.create({
			discordGuildID: notSavedGuilds[i],
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
		}));
	}
	const resolvedGuilds = await Promise.all(guildPromises);
	const allGuilds = guilds.concat(resolvedGuilds);
	client.prefix = new Map();
	allGuilds.forEach(element => {
		client.prefix.set(element.discordGuildID, element.prefix);
	});
});

client.on('message', async (msg) => {
	try {
		const prefix = client.prefix.get(msg.guild.id);
		if (!msg.content.startsWith(prefix) || msg.author.bot || msg.guild === null) return undefined;
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

		if(!commandToExec.allowedRoles.includes(user.role)){
			return msg.reply('You need a different role to execute that command.');
		}

		if(user.blacklist.isBlacklisted){
			return msg.reply(`You are currently blacklisted. You were blacklisted on ${user.blacklist.blacklistDate}. Please contact an admin if you think this is wrong.`);
		}

		if(commandToExec.cooldown.hasCooldown){
			const commandAudit = await getCommandHistoryWithFilter({userID: user._id, startTime: moment().subtract(commandToExec.cooldown.cooldownInMinutes, 'minutes').toDate(), endTime: moment().toDate(), sort: -1});
			if(commandAudit.length >= commandToExec.cooldown.executions){
				const availableTime = moment(commandAudit[0].executionTime).add(commandToExec.cooldown.cooldownInMinutes, 'minutes');
				console.log(availableTime)
				return msg.reply(`This command is on cooldown and will currently be available ${getHumanizedDuration(moment(), availableTime, true)}`)
			}
		}

		const commandValue = await commandToExec.execute(client, msg, args, user);

		await createCommandHistory({
			commandID: commandToExec._id,
			executionTime: moment(),
			userID: user._id,
			points: typeof commandValue === 'number' && commandValue !== 0 ? commandValue : 0 ,
		});
	} catch (err) {
		console.log(err)
		msg.reply(' there was an error executing that command.');
	}


});

client.login(botToken);
