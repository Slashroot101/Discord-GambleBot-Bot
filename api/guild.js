const request = require('request-promise');
const config = require('../config');

exports.create = (guildID) => {
    return new Promise(async (resolve) => {
		const options = {
			method: 'POST',
			uri: `${config.apiUrl}/guild/id/${guildID}`,
			body: {},
			json: true,
		};

		const guild = await request(options);
		resolve(guild.data[0]);
	});
}