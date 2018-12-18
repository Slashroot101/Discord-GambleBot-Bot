const fs = require(`fs`);
const Discord = require('discord.js');
const {getUserByDiscordID, create} = require('./api/user');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const {prefix, botToken} = require(`./config`);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;;
	let user = await getUserByDiscordID(msg.author.id);

	if(!user){
		user = await create(msg.author.id);
	}

	try {
		client.commands.get(command).execute(client, msg, args, user);
	}
	catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});

client.login(botToken);