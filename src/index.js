const Discord = require('discord.js');

const client = new Discord.Client();
const config = require('../config');
const fs = require('fs');
client.commands = new Discord.Collection();

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
	const commandDirectories = fs.readdirSync('./commands');
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
});

client.on('message', async (msg) => {
	if (!msg.content.startsWith(prefix) || msg.author.bot || msg.guild === null) return undefined;
	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift();
	const commandToExec = client.commands.get(command);
	if (!commandToExec) return;
});

client.login(config.botToken);