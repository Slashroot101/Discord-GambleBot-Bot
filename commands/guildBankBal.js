const { getGuildBankByGuildID } = require('../api/guild');

module.exports = {
  name: 'gbalance',
  description: 'Shows the balance of the guild. `!gbalance`',
  hasCooldown: false,
  duration: 1,
  requiresAdmin: false,
  generatesMoney: false,
  usages: 1,
  execute: async (client, msg) => {
    const guildBank = await getGuildBankByGuildID(msg.guild.id);
    msg.channel.send(`${msg.guild.name} has \`$${guildBank.points}\` in its account.`);
    return undefined;
  },
};
