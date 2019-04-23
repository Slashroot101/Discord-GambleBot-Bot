const config = require('../../../config');
const constants = require('../../constants');
const User = require('../../api/user');

module.exports = {
  name: 'daily',
  description: 'Gives you your daily money `!daily`',
  costData: {
    cost: 1,
    hasCost: true,
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
    const daily = Math.floor((Math.random() * config.points.max) + config.points.min);
    await User.addPointsToUser(user._id, client.commands.get('daily')._id, daily);
    message.channel.send(`You earned $${daily} for the day.`);
    return daily;
  },
};
