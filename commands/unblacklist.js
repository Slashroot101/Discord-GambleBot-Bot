const User = require('../api/user');

module.exports = {
	name: 'unban',
	description: 'Unblacklists the user. Ex: `!unban <@user>`',
	duration: 0,
	hasCooldown: false,
	generatesMoney: false,
	requiresAdmin: true,
	usages: 0,
	execute: async (client, message, args, user) => {
		if(args.length === 0) {
			message.reply('please include a user to unban, such as `!unban @user`');
		}

		const discordID = args[0].replace(/[^0-9]/g, '');

		if(isNaN(discordID)) {
			return message.reply('please enter a valid user. Such as `!unban @user`');
		}

		const personToUnban = await User.getUserByDiscordID(discordID);

		if(personToUnban.length === 0) {
			return message.reply('that person cannot be unbanned because they have never run a command!');
		}

		if(personToUnban.blacklist_date === null) {
			return message.reply('that user is already unbanned.');
		}

		await User.removeFromBlacklist(personToUnban.user_id);
		message.reply(`user ${personToUnban.discord_user_id} was unbanned.`);
	},
};