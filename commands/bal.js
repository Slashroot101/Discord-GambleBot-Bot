module.exports = {
	name: 'bal',
	description: 'Retrieves your balance. Ex: `!bal`',
	hasCooldown: false,
	duration: 0,
	requiresAdmin: false,
	generatesMoney: false,
	usages: 0,
	async execute(client, message, args, user) {

		const embed = {
			color: 0x00ff00,
			author: {
				name: message.member.user.tag,
				icon_url: message.member.user.avatarURL,
			},
			title: '',
			url: '',
			description: '',
			fields: [
				{
					name: '**Current Balance**',
					value: `${user.current_balance}`,
					inline: true,
				},
				{
					name: '**Total Money Gained**',
					value: `${user.total_points_gained}`,
					inline: true,
				},
			],
			timestamp: new Date(),
		};

		message.channel.send({ embed });
		return;
	},
};