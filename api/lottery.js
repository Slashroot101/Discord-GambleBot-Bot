const request = require('request-promise');
const config = require('../config');

exports.completeLottery = async (lotteryID) => {
  return new Promise(async (resolve) => {
    const options = {
      method: 'POST',
      uri: `${config.apiUrl}/lottery/${lotteryID}/winner`,
      json: true,
    };

    const lotteryWinner = await request(options);
    resolve(lotteryWinner.data);
  });
};
