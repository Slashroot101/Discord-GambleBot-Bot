const Guild = require('../../api/guild');

module.exports = {
	name: 'communicationChannel',
	description: 'Sets the bot\'s communication channel to this channel or off. The bot will only interact with users/post events in this channel when on. Ex: `{0}communicationChannel (on|off)`',
	costData: {
		cost: 1,
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
	async execute(client, message, args, user, guild) {
		const toggleValue = args[1];
		if(toggleValue !== 'off' && toggleValue !== 'on'){
			return message.reply(' you must provide whether communication filtering is toggled on or off.');
		}

		await Guild.updateGuild({onlyAllowCommunicationsHere: toggleValue === 'on', communicationChannel: toggleValue === 'on' ? message.channel.id : undefined});
		return message.reply(' communication channel successfully toggled!');
	},
};
