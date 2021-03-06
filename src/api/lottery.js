const request = require('request-promise');
const config = require('../../config');
const BASE_URL = 'api/lottery';

exports.create = async(lotteryData) => {
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}`,
    method: 'POST',
    body: lotteryData,
    json: true,
  };

  const lottery = await request(options);
  return lottery.lottery;
};

exports.getLotteryWithFilter = async(query) => {
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}`,
    method: 'GET',
    qs: query,
    json: true,
  };

  const lotteries = await request(options);
  return lotteries.lotteries;
};

exports.addTickets = async(lotteryID, tickets) => {
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}/${lotteryID}/ticket`,
    method: 'PUT',
    body: tickets,
    json: true,
  };

  const lottery = await request(options);
  return lottery.lottery;
};

exports.pickAndSetWinner = async(lotteryID) => {
	const options = {
		uri: `${config.apiUrl}/${BASE_URL}/${lotteryID}/winner`,
		method: 'PUT',
		json: true,
	};
	const lottery = await request(options);
	return lottery.lottery
};

exports.update = async(lotteryID, body) => {
  const options = {
    uri: `${config.apiUrl}/${BASE_URL}/${lotteryID}`,
    method: 'PUT',
    body: body,
    json: true,
  };

  const lottery = await request(options);
  return lottery.lottery;
};
