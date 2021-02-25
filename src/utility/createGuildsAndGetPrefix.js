const Guild = require('../api/guild');
const config = require('../../config');

module.exports = async (guildsIds) => {
  const guilds = await Guild.getGuildWithFilter({discordGuildID: guildsIds});
  const savedGuildIDs = guilds.map(x => x.discordGuildID);
  const notSavedGuilds = guildsIds.filter(x => x.includes(savedGuildIDs));
  const guildPromises = [];
  for(let i = 0; i < notSavedGuilds.length; i++){
    guildPromises.push(Guild.create({
      discordGuildID: notSavedGuilds[i],
      bank: {
        currentBalance: 0,
        totalPointsGained: 0
      },
      prefix: config.prefix,
      isGlobal: false,
      createdOn: new Date(),
      communicationChannel: {
        onlyAllowCommunicationsHere: false,
        discordChannelID: ''
      }
    }));
  }
  const resolvedGuilds = await Promise.all(guildPromises);
  const allGuilds = guilds.concat(resolvedGuilds);
  const prefix = new Map();
  allGuilds.forEach(element => {
    prefix.set(element.discordGuildID, element.prefix);
  });
  return prefix;
};
