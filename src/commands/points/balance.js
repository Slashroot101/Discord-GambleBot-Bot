const constants = require('../../constants');

module.exports = {
  name: 'bal',
  description: 'Retrieves your balance. Ex: `!bal`',
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
          value: `${user.points.currentPoints}`,
          inline: true,
        },
        {
          name: '**Total Money Gained**',
          value: `${user.points.totalAccruedPoints}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
    };

    message.channel.send({ embed });
  },
};
