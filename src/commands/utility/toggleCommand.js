const constants = require('../../constants');
const Guild = require('../../api/guild');

module.exports = {
	name: 'toggleCommand',
	description: 'Toggles a command off for your guild.',
	costData: {
		cost: 0,
		hasCost: false,
	},
	cooldown: {
		hasCooldown: false,
		executions: 1,
		cooldownInMinutes: 2
	},
	group: 'Utility',
	allowedRoles: [
	],
	async execute(client, message, args, user) {
		const isAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR", false);
		if(!isAdmin){
			return message.reply(' you do not have proper permission to execute this command.');
		}

		if(!args.length) {
			return message.reply(' you must supply a command for me to disable.');
		}

		if(args[1] === 'toggleCommand'){
			return message.reply(' disabling the command toggler is dangerous, and therefore is disabled. :-)');
		}

		if(args[0] !== 'on' && args[0] !== 'off'){
			return message.reply(' you must provide the toggle. Ex `!toggleCommand off bal`');
		}

		const command = client.commands.get(args[1]);
		if(!command){
			return message.reply(' a command with that name does not exist.');
		}

		const query = {};
		if(args[0] === 'on'){
			query.enabledCommands = [command._id];
		} else {
			query.disabledCommands = [command._id];
		}
		const guild = await Guild.getGuildWithFilter({discordGuildID: [message.guild.id]});
		await Guild.updateGuild(guild[0]._id, query);
		return message.reply(`${command.name} has successfully been toggled ${args[0]} for this guild.`);
	},
};
