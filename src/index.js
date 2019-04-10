const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('../config');
const User = require('./api/user');
const Role = require('./api/role');
const Guild = require('./api/guild');
const RoleConstants = require('./constants');
const MongoClient = require('mongodb').MongoClient;
const MongoDBProvider = require('./MongoDBProvider');

const client = new CommandoClient({
	commandPrefix: config.prefix,
	unknownCommandResponse: false,
	owner: config.owner,
	disableEveryone: true
});

client.setProvider(
	MongoClient.connect(config.db.host, {
		auth: {
			user: config.db.username,
			password: config.db.password,
			authdb: config.db.authdb,
		},
		autoReconnect: true,
		reconnectTries: 1000000,
		reconnectInterval: 3000}).then(client => new MongoDBProvider(client, 'GambleBot'))
).catch(console.error);

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['points', 'Points']
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
	.registerCommandsIn(path.join(__dirname, 'commands'));

// client.dispatcher.addInhibitor(async msg => {
// 	const isDM = msg.guild === null;
// 	let user = await User.getWithFilter({discordUserID: msg.author.id});
// 	if(!user.length){
// 		const baseUser = await Role.getWithFilter({name: RoleConstants.roles.baseUser});
// 		user = await User.createUser({discordUserID: msg.author.id, role: baseUser._id});
// 	}
// 	if(!isDM){
// 		let guild = await Guild.getGuildWithFilter({discordGuildID: msg.guild.id});
// 		if(!guild.length && !isDM){
// 			guild = await Guild.create({
// 				discordGuildID: msg.guild.id,
// 				bank: {
// 					currentBalance: 0,
// 					totalPointsGained: 0,
// 				},
// 				isGlobalCommandoRow: false,
// 				isGlobal: false,
// 				createdOn: new Date(),
// 				communicationChannel: {
// 					onlyAllowCommunicationsHere: false,
// 					discordChannelID: msg.channel.id,
// 				},
// 				disabledCommands: [],
// 			});
// 		}
// 	}
//
// 	return false;
// });

client.on('ready', async () => {
	console.log('Logged in!');
	const globalGuild = await Guild.getGuildWithFilter({discordGuildID: '0', isGlobal: true});
	if(!globalGuild){
		const guild = await Guild.create({
			discordGuildID: '0',
			bank: {
				currentBalance: 0,
				totalPointsGained: 0
			},
			isGlobal: true,
			createdOn: new Date(),
			settings: [],
			communicationChannel: {
				onlyAllowCommunicationsHere: false,
				discordChannelID: '0',
			},
			disabledCommands: [],
		});
	}
	client.user.setActivity('Pigchomp Boys');
});

client.login(config.botToken);
