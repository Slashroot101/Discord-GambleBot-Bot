const User = require('../api/user');

module.exports = {
	name: 'blacklist',
	description: 'Blacklists the user',
	duration: 0,
	hasCooldown: false,
	usages: 0,
	execute: async (client, message, args, user) => {
		console.log(user);
		if(user.blacklist_date !== null) {
			return message.reply('that user is already blacklisted.');
		}

		if(args.length === 0) {
			message.reply('please include a user to blacklist, such as `!blacklist @user <reason>`');
		}

		const discordID = args[0].replace(/[^0-9]/g, '');

		if(isNaN(discordID)) {
			return message.reply('please enter a valid user. Such as `!blacklist @user <reason>`');
		}

		const personToBan = await User.getUserByDiscordID(discordID);

		if(!personToBan) {
			return message.reply('that person cannot be blacklisted because they have never run a command!');
		}
		let reason = '';
		for(let i = 1; i < args.length; i++) {
			reason += ` ${args[i]}`;
		}
		await User.blacklist(personToBan.user_id, user.user_id, reason);
		message.reply(`user ${personToBan.discord_user_id} was blacklisted.`);
	},
};