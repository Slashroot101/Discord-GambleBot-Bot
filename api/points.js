const request = require('request-promise');
const config = require('../config');


exports.addPointsByDiscordID = (discordID, points) => new Promise(async (resolve) => {
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

exports.addPointsByUserID = (userID, points) => new Promise(async (resolve) => {
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

exports.addPointsToUserAudit = (executionID, points) => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/points/command-history/${executionID}/point/${points}`,
    body: {},
    json: true,
  };

  const user = await request(options);
  resolve(user.data[0]);
});

exports.daily = userID => new Promise(async (resolve) => {
  const options = {
    method: 'PUT',
    body: {},
    uri: `${config.apiUrl}/points/user-id/${userID}/daily`,
    json: true,
  };

  const reward = await request(options);
  resolve(reward.data.reward);
});

exports.getNetCommandPoints = (commandID, userID) => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/points/user-id/${userID}/command-id/${commandID}/net`,
    json: true,
  };

  const netPoints = await request(options);
  resolve(netPoints.data);
});

exports.getLeaderboard = pageNumber => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/points/page-number/${pageNumber}/leaderboard`,
    json: true,
  };

  const leaderboard = await request(options);
  resolve(leaderboard.data);
});
