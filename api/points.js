const request = require('request-promise');
const config = require('../config');


exports.addPointsByDiscordID = (discordID, points) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'PUT',
			body: {
				points,
			},
			uri: `${config.apiUrl}/points/discord-id/${discordID}`,
			json: true,
		};

		const user = await request(options);
		resolve(user.data.length ? user.data[0] : user.data);
	});
};

exports.addPointsByUserID = (userID, points) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'PUT',
			body: {
				points,
			},
			uri: `${config.apiUrl}/points/user-id/${userID}`,
			json: true,
		};

		const user = await request(options);
		resolve(user.data.length ? user.data[0] : user.data);
	});
};

exports.daily = (userID) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'PUT',
			body: {},
			uri: `${config.apiUrl}/points/user-id/${userID}/daily`,
			json: true,
		};

		const reward = await request(options);
		resolve(reward.data.reward);
	});
};

exports.getLeaderboard = (pageNumber) => {
	return new Promise(async (resolve) => {
		const options = {
			method: 'GET',
			uri: `${config.apiUrl}/points/page-number/${pageNumber}/leaderboard`,
			json: true,
		};

		const leaderboard = await request(options);
		resolve(leaderboard.data.leaderboard);
	});
};