const fs = require('fs');
const Discord = require('discord.js');
const { getUserByDiscordID, create } = require('./api/user');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { prefix, botToken } = require('./config');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandAPI = require('./api/commands');

client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		const newCommand = await commandAPI.create(command);
		command.id = newCommand.commands.id;
		client.commands.set(command.name, command);
	}
});

client.on('message', async msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;

	const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	try {
		if (!client.commands.has(command)) return;
		let user = await getUserByDiscordID(msg.author.id);

		if(!user) {
			user = await create(msg.author.id);
		}

		const commandToExec = client.commands.get(command);

		const isOnCooldown = await commandAPI.isCommandOnCooldown(commandToExec.id, user.user_id);

		if(isOnCooldown){
			return msg.reply(' that command is currently on cooldown.');
		}

		commandToExec.execute(client, msg, args, user);
		commandAPI.addToUserAudit(commandToExec.id, user.user_id);
	}
	catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});

client.login(botToken);