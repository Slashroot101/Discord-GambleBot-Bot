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
