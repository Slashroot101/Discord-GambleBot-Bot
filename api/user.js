const request = require('request-promise');
const config = require('../config');

exports.getUserByDiscordID = (discordID) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'GET',
			uri: `${config.apiUrl}/user/discord-id/${discordID}`,
			json: true,
		};

		const user = await request(options);
		resolve(user.data.length ? user.data[0] : user.data);
	});
};

exports.create = (discordID) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'POST',
			uri: `${config.apiUrl}/user`,
			body: {
				discordID,
			},
			json: true,
		};

		const user = await request(options);
		resolve(user.data[0]);
	});
};

exports.blacklist = (userID, userWhoBanned, reason) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'POST',
			uri: `${config.apiUrl}/user/user-id/${userID}/blacklist`,
			body: {
				userWhoBanned, reason,
			},
			json: true,
		};

		const user = await request(options);
		resolve(user.data[0]);
	});
};

exports.removeFromBlacklist = (userID) => {
	return new Promise(async(resolve) => {
		const options = {
			method: 'DELETE',
			uri: `${config.apiUrl}/user/user-id/${userID}/blacklist`,
			json: true,
		};

		await request(options);
		resolve();
	});
};

exports.updateRoleID = (userID, roleID) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'PUT',
			uri: `${config.apiUrl}/user/user-id/${userID}/role/${roleID}`,
			json: true,
		};

		const user = await request(options);
		resolve(user.data.user);
	});
};