const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const Points = require('../api/points');

module.exports = {
	name: 'net',
	description: 'See how much you have netted off of each command. `Ex: !net bj`',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	generatesMoney: false,
	async execute(client, message, args, user) {
		if(args.length === 0) {
			message.reply('You must supply a command to check your net values on. Such as `!net bj`');
			return;
		}
		let command;
		for (const file of commandFiles) {
			const requiredCommand = require(`./${file}`);
			if(requiredCommand.name === args[0]) {
				command = requiredCommand;
				break;
			}
		}
		if(command.generatesMoney) {
			const netPoints = await Points.getNetCommandPoints(command.id, user.user_id);
			console.log(netPoints.length)
			message.reply(`you have netted $${netPoints.length ? netPoints.netPoints.total_points_gained : 0} off of ${command.name}.`);
		}
		else if(!command.generatesMoney) {
			message.reply(`you have netted $0 off of ${command.name}. This command does not generate money.`);
		}
		else {
			message.reply('that command does not exist.');
		}
	},
};