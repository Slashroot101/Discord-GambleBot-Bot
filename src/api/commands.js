const request = require('request-promise');
const config = require('../../config');

exports.create = commands => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/commands`,
    body: commands,
    json: true,
  };

  const command = await request(options);
  resolve(command.data);
});

exports.addToUserAudit = (commandID, userID) => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/commands/${commandID}/user/${userID}`,
    body: {},
    json: true,
  };

  const commandAudit = await request(options);
  resolve(commandAudit.data);
});

exports.isCommandOnCooldown = (commandID, userID) => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/commands/${commandID}/user/${userID}/cooldown`,
    json: true,
  };

  const isOnCooldown = await request(options);
  resolve(isOnCooldown.data);
});

exports.toggleMaintenanceMode = (commandID, maintenanceMode) => new Promise(async (resolve) => {
  const options = {
    method: 'PUT',
    uri: `${config.apiUrl}/commands/command/${commandID}/maintenance`,
    body: {
      maintenanceMode,
    },
    json: true,
  };

  const command = await request(options);
  resolve(command.data);
});
