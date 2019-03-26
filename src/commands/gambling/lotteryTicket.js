const { addPointsByUserID } = require('../../api/points');
const { create: createLotteryTickets } = require('../../api/lotteryTickets');
const { getActiveForDiscordGuildID, getCurrentGlobalLottery } = require('../../api/lottery');

module.exports = {
  name: 'ticket',
  description: 'Buys a lottery ticket. Ex `!ticket <numberTickets> <global|guild>`',
  requiresAdmin: false,
  duration: 1,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  async execute(client, message, args, user) {
  	const numTickets = Number.parseInt(args[0], 10);
    if ((Number.isNaN(numTickets) && numTickets >= 1) || numTickets >= 100) {
      message.reply(' your number of tickets must be greater than or equal to 1 but less than 100 and an integer.');
      return;
    }

    if (args[1] !== 'global' && args[1] !== 'guild') {
    	message.reply(' you must specify what level of lottery you are purchasing into. Global or guild level ');
    	return;
    }

	    const lottery = args[1] === 'guild' ? await getActiveForDiscordGuildID(message.guild.id) : await getCurrentGlobalLottery();
      console.log(lottery);
	    if (Object.entries(lottery).length === 0 && lottery.constructor === Object) {
	    	message.reply(' there is no active lottery to buy tickets for.');
	    	return;
	    }
	    await createLotteryTickets(lottery.lottery.lotteryid, numTickets, user.user_id);
	    await addPointsByUserID(
	    	user.user_id,
		    lottery.lottery.guild_id,
		    numTickets * lottery.lottery.ticket_cost,
	    );
	    message.reply(` you have succesfully purchased ${numTickets} tickets. Good luck!`);

  },
};
