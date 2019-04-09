const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('../config');
const User = require('./api/user');
const Role = require('./api/role');
const Command = require('./api/command');
const RoleConstants = require('./constants');
const MongoClient = require('mongodb').MongoClient;
const MongoDBProvider = require('commando-provider-mongo');

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

client.dispatcher.addInhibitor(async msg => {
	console.log(msg);
	let user = await User.getWithFilter({discordUserID: msg.author.id});
	if(!user.length){
		const baseUser = await Role.getWithFilter({name: RoleConstants.roles.baseUser});
		user = await User.createUser({discordUserID: msg.author.id, role: baseUser._id});
	}

});

client.on('ready', () => {
	console.log('Logged in!');
	client.user.setActivity('Pigchomp Boys');
});

client.login(config.botToken);
