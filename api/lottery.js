const request = require('request-promise');
const config = require('../config');

exports.completeLottery = async lotteryID => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/lottery/${lotteryID}/winner`,
    json: true,
  };

  const lotteryWinner = await request(options);
  resolve(lotteryWinner.data);
});

exports.create = async lottery => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/lottery`,
    body: {
      lottery,
    },
    json: true,
  };

  const createdLottery = await request(options);
  console.log(createdLottery)
  resolve(createdLottery.data);
});
