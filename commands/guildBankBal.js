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
	  const embed = {
		  color: 0x00ff00,
		  author: {
			  name: msg.member.user.tag,
			  icon_url: msg.member.user.avatarURL,
		  },
		  title: `${msg.guild.name}`,
		  url: '',
		  description: '',
		  fields: [
			  {
				  name: '**Current Balance**',
				  value: `${guildBank.points}`,
				  inline: true,
			  },
		  ],
		  timestamp: new Date(),
	  };

	  msg.channel.send({ embed });
    return undefined;
  },
};
