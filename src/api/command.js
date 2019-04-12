const request = require('request-promise');
const config = require('../../config');

const BASE_URL = 'api/commands/';

exports.getWithFilter = async (query) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/${BASE_URL}`,
    qs: query,
    json: true,
  };

  const commands = await request(options);
  return commands.commands;
};

exports.createCommand = async (commandObject) => {
  delete commandObject.execute;
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/${BASE_URL}`,
    body: commandObject,
    json: true,
  };

  const command = await request(options);
  return command.command;
};

exports.updateCommand = async (id, commandObject) => {
	delete commandObject.execute;
	delete commandObject._id;
	const options = {
		method: 'PUT',
		uri: `${config.apiUrl}/${BASE_URL}${id}`,
		body: commandObject,
		json: true,
	};

	const command = await request(options);
	console.log(command)
	return command.command;
};