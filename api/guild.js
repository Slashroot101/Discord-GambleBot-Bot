const request = require('request-promise');
const config = require('../config');

exports.create = guilds => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/guild/`,
    body: { guilds },
    json: true,
  };

  const guild = await request(options);
  resolve(guild);
});

exports.addPointsToGuildBank = (guildID, points) => new Promise(async (resolve) => {
  const options = {
    method: 'PUT',
    uri: `${config.apiUrl}/guild/guild-id/${guildID}/points`,
    body: {
      points,
    },
    json: true,
  };

  const guild = await request(options);
  resolve(guild.data[0]);
});

exports.getGuildBankByGuildID = async guildID => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/guild/discord-guild-id/${guildID}/bank`,
    json: true,
  };

  const guildBank = await request(options);
  resolve(guildBank.data.guildBank);
});


exports.getByGuildID = guildID => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/guild/guild-id/${guildID}`,
    json: true,
  };

  const guild = await request(options);
  console.log(guild);
  resolve(guild.data.guild);
});
