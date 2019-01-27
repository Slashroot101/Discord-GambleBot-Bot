const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

module.exports = {
	name: 'net',
	description: 'See how much you have netted off of each command. `Ex: !net bj`',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	generatesMoney: false,
	async execute(client, message, args, user) {
		console.log(args)
		if(args.length === 0){
			message.reply('You must supply a command to check your net values on. Such as `!net bj`');
			return;
		}
		let command;
		console.log(commandFiles)
		for (const file of commandFiles) {
			const requiredCommand = require(`./${file}`);
			if(requiredCommand.name === args[0]){
				command = requiredCommand;
				break;
			}
		}

		console.log(command)


	},
};