const { getLeaderboard } = require('../api/points');

module.exports = {
  name: 'lb',
  description: 'Leaderboard. Ex: `!lb`',
  hasCooldown: true,
  duration: 1,
  generatesMoney: false,
  requiresAdmin: false,
  usages: 5,
  execute: async (client, message, args) => {
    let page;
    if (args.length === 0) {
      page = 0;
    } else {
      page = parseInt(args[0], 10);
    }
    if (Number.isNaN(page)) {
      message.reply('You must provide the page as a number, such as 1');
      return;
    }
    const lb = await getLeaderboard(page);
    if (lb.leaderboard.length) {
      let embedString = '';
      const neededUsers = lb.leaderboard.map(x => x.discord_user_id);
      const userObjects = client.users.filter(x => neededUsers.includes(x.id));

      for (let i = 0; i < lb.leaderboard.length; i += 1) {
        embedString += `${i + 1}. ${userObjects.find(user => user.id === lb.leaderboard[i].discord_user_id).username} : $${lb.leaderboard[i].current_balance}\n`;
      }

      const embed = {
        color: 0x00ff00,
        author: {
          name: message.member.user.tag,
          icon_url: message.member.user.avatarURL,
        },
        title: 'Leaderboard',
        url: '',
        description: 'Total Rankings',
        fields: [
          {
            name: embedString,
            value: '\u200b',
            inline: true,
          },
        ],
        footer: { text: `Page: ${page + 1}/${lb.numPages}` },
        timestamp: new Date(),
      };

      message.channel.send({ embed });
    } else {
      message.reply('it looks like there is not any data to show right now.');
    }
  },
};
