const { getCurrentGlobalLottery, getActiveForDiscordGuildID } = require('../../api/lottery');
const getHumanizedDuration = require('../../utility/getHumanizedDuration');

module.exports = {
  name: 'currentLottery',
  description: 'Shows the current lottery in the guild/globally.',
  requiresAdmin: false,
  duration: 1,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  async execute(client, message) {
    const [globalLottery, localLottery] = await Promise.all([
      getCurrentGlobalLottery(), getActiveForDiscordGuildID(message.guild.id),
    ]);

    const fields = [];
    if (localLottery) {
    	fields.push({
		    name: '**Local**',
		    value: `This lottery will end ${getHumanizedDuration(localLottery.lottery.current_time, localLottery.lottery.end_date, true)} \nCurrent Jackpot: $${localLottery.jackpot ? localLottery.jackpot.jackpot : 0}`,
		    inline: true,
	    });
    } else {
	    fields.push({
		    name: '**Local**',
		    value: 'None are currently active.',
		    inline: true,
	    });
    }

    if (Object.entries(globalLottery).length !== 0 && globalLottery.constructor === Object) {
	    fields.push({
		    name: '**Local**',
		    value: `This lottery will end ${getHumanizedDuration(globalLottery.lottery.current_time, globalLottery.lottery.end_date, true)} \nCurrent Jackpot: $${globalLottery.lottery.jackpot > 0 ? globalLottery.lottery.jackpot : 0}`,
		    inline: true,
	    });
    } else {
	    fields.push({
		    name: '**Global**',
		    value: 'None are currently active.',
		    inline: true,
	    });
    }

	  const embed = {
		  color: 0x00ff00,
		  title: 'Current Lotteries',
		  url: '',
		  description: 'To purchase tickets `!lotteryTicket <amountOfTickets> <guild OR global>`',
		  fields,
		  timestamp: new Date(),
	  };
	  message.channel.send({ embed });
  },
};
