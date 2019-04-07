const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { getUser } = require('../../api/user');

module.exports = class BalanceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'balance',
      aliases: ['bank', 'points', 'bal'],
      group: 'points',
      memberName: 'balance',
      description: 'Retrieves your user balance.',
      details: oneLine`
        This command returns your current user balance and the total points you have gotten.
			`,
      examples: ['balance'],
    });
  }

  async run(msg, args) {
    const user = await getUser({ discordUserID: msg.author.id });
    if (!user[0]){
      return msg.say('Beep boop. You do not exist in my brain now. Please try to execute a command again to get added.');
    }
    const embed = {
      color: 0x00ff00,
      author: {
        name: msg.member.user.tag,
        icon_url: msg.member.user.avatarURL,
      },
      title: '',
      url: '',
      description: '',
      fields: [
        {
          name: '**Current Balance**',
          value: `${user[0].points.currentPoints}`,
          inline: true,
        },
        {
          name: '**Total Money Gained**',
          value: `${user[0].points.totalAccruedPoints}`,
          inline: true,
        },
      ],
      timestamp: new Date(),
    };
    return msg.embed(embed)
  }
};
