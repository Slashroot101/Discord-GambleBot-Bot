const request = require('request-promise');
const config = require('../../config');
const BASE_URL = 'api/guilds';

exports.updateGuild = async (id, guildObject) => {
  console.log(typeof guildObject)
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}/${id}`,
    method: 'PUT',
    body: guildObject,
    json: true,
  };

  const guild = await request(options);
  return guild.guild;
};

exports.getGuildWithFilter = async(query) => {
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}`,
    method: 'GET',
    qs: query,
    json: true,
  };

  const guilds = await request(options);
  return guilds.guilds;
};

exports.create = async(guildObject) => {
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}`,
    method: 'POST',
    body: guildObject,
    json: true,
  };

  const guild = await request(options);
  return guild.guild;
};
