const request = require('request-promise');
const config = require('../../config');

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
  resolve(createdLottery.data);
});

exports.getActiveForDiscordGuildID = guildID => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/lottery/discord-guild/${guildID}`,
    json: true,
  };

  const lottery = await request(options);
  resolve(lottery.data);
});

exports.getCurrentGlobalLottery = () => new Promise(async (resolve) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/lottery/global`,
    json: true,
  };

  const globalLottery = await request(options);
  resolve(globalLottery.data);
});
