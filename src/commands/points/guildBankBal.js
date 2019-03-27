const { getGuildBankByGuildID, getGlobalGuild } = require('../../api/guild');

module.exports = {
  name: 'gbalance',
  description: 'Shows the balance of the guild and global banks. `!gbalance`',
  hasCooldown: false,
  duration: 1,
  requiresAdmin: false,
  generatesMoney: false,
  usages: 1,
  execute: async (client, msg) => {
    const guildBank = await getGuildBankByGuildID(msg.guild.id);
    const globalGuild = await getGlobalGuild();
    const globalBank = await getGuildBankByGuildID(globalGuild.guild_id);
    console.log(globalBank);
	  const embed = {
		  color: 0x00ff00,
		  author: {
			  name: msg.member.user.tag,
			  icon_url: msg.member.user.avatarURL,
		  },
		  title: `:moneybag:  ${msg.guild.name} :moneybag: `,
		  url: '',
		  description: '',
		  fields: [
			  {
				  name: '**Guild Balance**',
				  value: `$${guildBank.points} `,
				  inline: true,
			  },
			  {
				  name: '**Global Balance**',
				  value: `$${globalBank.points} `,
				  inline: true,
			  },
		  ],
		  timestamp: new Date(),
	  };

	  msg.channel.send({ embed });
    return undefined;
  },
};
