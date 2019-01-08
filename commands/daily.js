const { daily } = require(`../api/points`);

module.exports = {
    name: 'daily',
    description: 'Balance',
    hasCooldown: true,
    duration: 60*24,
    usages: 1,
    execute: async (client, message, args, user) => {
        let reward = await daily(user.user_id);
        message.reply(`you have been awarded $${reward} for the day!`);
    }
}