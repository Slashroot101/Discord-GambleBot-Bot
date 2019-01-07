const request = require('request-promise');
const config = require('../config');

exports.create = (commands) => {
	return new Promise(async (resolve) => {
		let options = {
			method: 'POST',
			uri: `${config.apiUrl}/commands`,
			body: commands,
			json: true,
		};

		let command = await request(options);
		resolve(command.data);
	});
};

exports.addToUserAudit = (commandID, userID) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'POST',
			uri: `${config.apiUrl}/commands/${commandID}/user/${userID}`,
			body: {},
			json: true,
		};

		const commandAudit = await request(options);
		resolve(commandAudit.data);
	});
};