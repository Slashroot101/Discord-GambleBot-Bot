let User = require('../api/user');

module.exports = {
	name: 'blacklist',
	description: 'Blacklists the user',
	duration: 0,
	hasCooldown: false,
	usages: 0,
	execute: async (client, message, args, user) => {
        if(args.length === 0){
            message.reply('please include a user to blacklist, such as `!blacklist @user <reason>`');
        }

        let discordID = args[0].replace(/[^0-9]/g, "");

        if(isNaN(discordID)){
             return message.reply('please enter a valid user. Such as `!blacklist @user <reason>`')
        }

        let personToBan = await User.getUserByDiscordID(discordID);

        if(!personToBan){
            return message.reply('that person cannot be blacklisted because they have never run a command!');
        }
        let reason;
        for(let i = 1; i < args.length; i++){
            console.log(args[i])
            reason += ` ${args[i]}`
        }
        let blacklistedUser = await User.blacklist(personToBan.user_id, user.user_id, reason);
	},
};