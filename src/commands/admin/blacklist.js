const User = require('../../api/user');
const Role = require('../../api/role');
const constants = require('../../constants');

module.exports = {
  name: 'blacklist',
  description: 'Blacklists a user `{0}blacklist @user (on|off)`',
  costData: {
    cost: 1,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: true,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Admin',
  allowedRoles: [
    constants.roles.admin,
  ],
  async execute(client, message, args, user) {
	if(args.length !== 2){
		return message.reply(' you must provide a user to ban and whether you are banning or unbanning!');
	}

	if(args[1] !== 'on' && args[1] !== 'off'){
		return message.reply(' you must supplement whether you are banning or unbanning the user with on/off');
	}

	if(!args[0].includes('@')){
		return message.reply(' please mention the user with an @ if you are trying to blacklist them');
	}

	const userToBlacklist = args[0].substr(args[0].indexOf('@') + 1, args[0].length - 3);
	console.log(userToBlacklist)
	let userRecord = await User.getWithFilter({discordUserID: userToBlacklist});

	if(!userRecord.length){
		const role = await Role.getWithFilter({name: 'baseUser'});
		userRecord = await User.createUser(userToBlacklist, role[0]._id)
	} else {
		userRecord = userRecord[0];
	}

	console.log(userRecord)

	await User.updateUser(userRecord._id, { blacklist: args[1] === 'on'});
	return message.reply(` succesfully turned the blacklist ${args[1]} for the user!`);
  },
};
