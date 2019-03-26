const request = require('request-promise');
const config = require('../../config');

exports.create = async (lotteryID, numTickets, userID) => new Promise(async (resolve) => {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/lottery-ticket/`,
    body: {
      lotteryID,
      numTickets,
	    userID,
    },
	  json: true,
  };

  const lotteryTickets = await request(options);
  resolve(lotteryTickets.data.lotteryTickets);
});
