const constants = require('../../constants');

module.exports = {
  name: 'gbal',
  description: 'Retrieves your guild balance. Ex: `{0}gbal`',
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
  async execute(client, message, args, user, guild) {
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
          value: `${guild.bank.currentBalance}`,
          inline: true,
        },
        {
          name: '**Total Money Gained**',
          value: `${guild.bank.totalPointsGained}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
    };

    message.channel.send({ embed });
  },
};
