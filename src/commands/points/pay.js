const config = require('../../../config');
const constants = require('../../constants');
const User = require('../../api/user');
const Role = require('../../api/role');

module.exports = {
  name: 'pay',
  description: 'Pays the given user the given amount. Ex: `{0}pay @slashroot101 25`',
  costData: {
    cost: 1,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: false,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Points',
  allowedRoles: [
    constants.roles.baseUser, constants.roles.admin,
  ],
  async execute(client, message, args, user) {
    if(!args[0]){
      return message.reply(' you must provide a user to pay!');
    }

    let payment = Number.parseInt(args[1]);
    if(isNaN(payment) || !payment || payment <= 0 || payment > Number.MAX_SAFE_INTEGER){
      return message.reply(` you must provide an amount to pay that is positive and not 0 and less than ${Number.MAX_SAFE_INTEGER}`);
    }

    if(user.points.currentPoints < payment){
      return message.reply(` you cannot pay more money than you have. You currently only have ${user.points.currentPoints}`);
    }

    let userToPayDiscordID = args[0].match(/^<@!?(\d+)>$/)[0];
    let userToPay = await User.getWithFilter({discordUserID: userToPayDiscordID});
    if(userToPay.length === 0){
      const role = await Role.getWithFilter({name: 'baseUser'});
      userToPay = await User.createUser(userToPayDiscordID, role[0]._id);
    } else {
      userToPay = userToPay[0];
    }

    let thisCommandID = client.commands.get('pay');
    await Promise.all([
      User.addPointsToUser(user._id, thisCommandID._id, payment * -1),
      User.addPointsToUser(userToPay._id, thisCommandID._id, payment),
    ]);

    message.reply(` successfully paid ${args[0]} $${args[1]}!`);
    return payment * -1;
  },
};
