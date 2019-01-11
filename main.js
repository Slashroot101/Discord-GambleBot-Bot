const fs = require('fs');
const Discord = require('discord.js');
const { getUserByDiscordID, create } = require('./api/user');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { prefix, botToken } = require('./config');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commandAPI = require('./api/commands');
const moment = require('moment');

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

		if (user.length === 0) {
			user = await create(msg.author.id);
		}

		if(user.blacklist_date !== null && user.length !== 0) {
			return msg.reply(`you were blacklisted on ${moment(user.blacklist_date)}. Please contact an administrator if you think this is incorrect.`);
		}

		const commandToExec = client.commands.get(command);

		if(commandToExec.requiresAdmin && user.roleName !== 'admin'){
			return msg.reply(`nice try :-). You must be an admin to run that command.`);
		}

		if (commandToExec.hasCooldown) {
			const isOnCooldown = await commandAPI.isCommandOnCooldown(commandToExec.id, user.user_id);

			if (isOnCooldown.onCooldown) {
				const availableTime = moment(isOnCooldown.oldestAudit.execution_time).add(isOnCooldown.oldestAudit.duration, 'minutes');
				const duration = moment.duration(availableTime.diff(moment()));
				return msg.reply(` that command is currently on cooldown and will be available ${duration.humanize(true)}.`);
			}

		}

		commandToExec.execute(client, msg, args, user);
		commandAPI.addToUserAudit(commandToExec.id, user.user_id);
	}
	catch (error) {
		msg.reply('there was an error trying to execute that command!');
	}
});

client.login(botToken);