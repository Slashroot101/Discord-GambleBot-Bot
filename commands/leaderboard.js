const { getLeaderboard } = require('../api/points');

module.exports = {
	name: 'lb',
	description: 'Leaderboard. Ex: `!lb`',
	hasCooldown: true,
	duration: 1,
	generatesMoney: false,
	requiresAdmin: false,
	usages: 5,
	execute: async (client, message, args, user) => {
		let page;
		if(args.length === 0) {
			page = 0;
		} else {
			page = parseInt(args[0]);
		}
		if(isNaN(page)){
			return message.reply(`You must provide the page as a number, such as 1`);
		}
		const lb = await getLeaderboard(page);
		if(lb.leaderboard.length){
			let embedString = '';
			for(let i = 0; i < lb.leaderboard.length; i++){
				const lbUser = await client.fetchUser(lb.leaderboard[i].discord_user_id);
				embedString += `${i + 1}. ${lbUser.username} : $${lb.leaderboard[i].current_balance}\n`;
			}

			const embed = {
				color: 0x00ff00,
				author: {
					name: message.member.user.tag,
					icon_url: message.member.user.avatarURL,
				},
				title: 'Leaderboard',
				url: '',
				description: `Total Rankings`,
				fields: [
					{
						name: embedString,
						value: `\u200b`,
						inline: true
					}
				],
				footer: {text: `Page: ${page + 1}/${lb.numPages}`},
				timestamp: new Date()
			};

			message.channel.send({embed})

		} else {
			return message.reply('it looks like there is not any data to show right now.')
		}
	},
};