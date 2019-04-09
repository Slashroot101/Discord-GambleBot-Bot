const Discord = require('discord.js');

const client = new Discord.Client();
const {prefix, botToken} = require('../config');
const fs = require('fs');
const User = require('../src/api/user');
const Role = require('../src/api/role');
const Command = require('../src/api/command');
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
			client.commands.set(command.name, foundCommand);
		});
	}
});

client.on('message', async (msg) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot || msg.guild === null) return undefined;
	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift();
	const commandToExec = client.commands.get(command);
	if (!commandToExec) return;
	let user = await User.getWithFilter({discordUserID: msg.author.id});
	if(!user.length){
		const role = await Role.getWithFilter({name: 'baseUser'});
		user = await User.createUser(msg.author.id, role[0]._id);
	}

	if(user.blacklist.isBlacklisted){
		return msg.reply(`You are currently blacklisted. You were blacklisted on ${user.blacklist.blacklistDate}. Please contact an admin if you think this is wrong.`);
	}
});

client.login(botToken);
