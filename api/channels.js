const request = require('request-promise');
const config = require('../config');

exports.getChannelForDiscordGuildID = discordGuildID => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/channel/discord-guild-id/${discordGuildID}`,
    json: true,
  };

  const channel = await request(options);
  resolve(channel.data.channel);
});

exports.create = (discordChannelID, createdBy, guildID) => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/channel`,
    body: {
      discordChannelID,
      createdBy,
      guildID,
    },
    json: true,
  };

  const channel = await request(options);
  resolve(channel.data.channel);
});
