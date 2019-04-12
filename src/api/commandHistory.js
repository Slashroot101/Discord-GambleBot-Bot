const request = require('request-promise');
const config = require('../../config');

const BASE_URL = 'api/command-history/';

exports.getCommandHistoryWithFilter = async (query) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/${BASE_URL}`,
    qs: query,
    json: true,
  };

  const commandHistory = await request(options);
  return commandHistory.commandHistory;
};

exports.createCommandHistory = async (commandHistoryObject) => {
  console.log(commandHistoryObject)
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/${BASE_URL}`,
    body: commandHistoryObject,
    json: true,
  };

  const commandHistory = await request(options);
  return commandHistory.commandHistory;
};
