const Command = require('../../api/command');

module.exports = {
	name: 'maintenanceMode',
	description: 'Puts a command in  maintenance mode.',
	costData: {
		cost: 0,
		hasCost: false,
	},
	cooldown: {
		hasCooldown: false,
		executions: 1,
		cooldownInMinutes: 2
	},
	group: 'Admin',
	allowedRoles: [
	],
	async execute(client, message, args, user) {
		if(args.length < 2){
			return message.reply('You need to provide a command to toggle maintenance on for and whether it\'\ on/off')
		}

		if(args[1] === 'maintenanceMode'){
			return message.reply(' hey, cut it out.');
		}

		const command = client.commands.get(args[1]);
		if(!command){
			return message.reply(' this command does not exist. Please provide a valid command to continue');
		}

		if(args[0] !== 'off' && args[0] !== 'on'){
			return message.reply('you must supplement how to toggle the command (on/off)')
		}
		command.isInMaintenanceMode = args[0] !== 'off';
		client.commands.set(args[1], command);
		await Command.updateCommand(command._id, {isInMaintenanceMode: command.isInMaintenanceMode});
		return message.reply(` maintenance mode for ${command.name} was successfully toggled ${args[0]}`);
	},
};
