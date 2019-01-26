const User = require('../api/user');

module.exports = {
	name: 'ban',
	description: 'Bans the user. `!ban <@user>`',
	duration: 0,
	hasCooldown: false,
	requiresAdmin: true,
	generatesMoney: false,
	usages: 0,
	execute: async (client, message, args, user) => {
		if(args.length === 0) {
			message.reply('please include a user to ban, such as `!ban @user <reason>`');
			return;
		}

		const discordID = args[0].replace(/[^0-9]/g, '');

		if(isNaN(discordID)) {
			message.reply('please enter a valid user. Such as `!ban @user <reason>`');
			return;
		}

		const personToBan = await User.getUserByDiscordID(discordID);

		if(personToBan.length === 0) {
			message.reply('that person cannot be banned because they have never run a command!');
			return;
		}

		if(personToBan.blacklist_date !== null) {
			message.reply('that user is already banned.');
			return;
		}

		let reason = '';
		for(let i = 1; i < args.length; i++) {
			reason += ` ${args[i]}`;
		}
		await User.blacklist(personToBan.user_id, user.user_id, reason);
		message.reply(`user ${personToBan.discord_user_id} was banned.`);
		return;
	},
};