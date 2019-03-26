const { daily } = require('../../api/points');

module.exports = {
  name: 'daily',
  description: 'Runs the daily quest, which gives you money to play with. Ex: `!daily`',
  hasCooldown: true,
  duration: 1,
  requiresAdmin: false,
  generatesMoney: true,
  usages: 1,
  execute: async (client, message, args, user) => new Promise(async (resolve) => {
    const reward = await daily(user.user_id);
    message.reply(`you have been awarded $${reward} for the day!`);
    return resolve(reward);
  }),
};
