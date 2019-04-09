const constants = require('../../constants');

module.exports = {
  name: 'bal',
  description: 'Retrieves your balance. Ex: `!bal`',
  costData: {
    cost: 1,
    hasCost: true,
  },
  cooldown: {
    hasCooldown: true,
    executions: 1,
    cooldownInMinutes: 2
  },
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
          value: `${user.current_balance}`,
          inline: true,
        },
        {
          name: '**Total Money Gained**',
          value: `${user.total_points_gained}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
    };

    message.channel.send({ embed });
  },
};
