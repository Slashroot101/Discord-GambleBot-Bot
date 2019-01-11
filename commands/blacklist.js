const User = require('../api/user');

module.exports = {
	name: 'ban',
	description: 'Bans the user. `!ban <@user>`',
	duration: 0,
	hasCooldown: false,
	requiresAdmin: true,
	usages: 0,
	execute: async (client, message, args, user) => {
		if(args.length === 0) {
			message.reply('please include a user to ban, such as `!ban @user <reason>`');
		}

		const discordID = args[0].replace(/[^0-9]/g, '');

		if(isNaN(discordID)) {
			return message.reply('please enter a valid user. Such as `!ban @user <reason>`');
		}

		const personToBan = await User.getUserByDiscordID(discordID);
		console.log(personToBan)

		if(personToBan.length === 0) {
			return message.reply('that person cannot be banned because they have never run a command!');
		}

		if(personToBan.blacklist_date !== null) {
			return message.reply('that user is already banned.');
		}

		let reason = '';
		for(let i = 1; i < args.length; i++) {
			reason += ` ${args[i]}`;
		}
		await User.blacklist(personToBan.user_id, user.user_id, reason);
		message.reply(`user ${personToBan.discord_user_id} was banned.`);
	},
};