const { create: createLottery, getLotteryWithFilter } = require('../../api/lottery');
const { lottery } = require('../../constants');
const moment = require('moment');

module.exports = {
  name: 'lottery',
  description: 'Starts a lottery for the given amount of hours with the given ticket cost. Try `{0}lottery <ticketCost> <durationInHours> <numTicketsToStart>`. Note that the last argument will default to ' + lottery.INITIAL_NEEDED_TICKETS + ' if it is less.',
  costData: {
    cost: 1,
    hasCost: true,
  },
  cooldown: {
    hasCooldown: false,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Gambling',
  allowedRoles: [
  ],
  async execute(client, message, args, user, guild) {
    if (args.length !== 3) {
      message.reply(' you must provide 3 arguments. Ex: `!lottery 250 2 6`');
      return 0;
    }

    const parsedNumTickets = Number.parseInt(args[2]);
    const numStartingTickets = Number.isNaN(parsedNumTickets) || parsedNumTickets < lottery.INITIAL_NEEDED_TICKETS ? lottery.INITIAL_NEEDED_TICKETS : parsedNumTickets;
    const ticketCost = Number.parseInt(args[0], 10);
    if (ticketCost < 1 || Number.isNaN(ticketCost) || ticketCost > Number.MAX_SAFE_INTEGER || ticketCost < Number.MIN_SAFE_INTEGER) {
      message.reply(' the ticket cost cannot be 0 or negative. It must be an integer.');
      return 0;
    }

    if(numStartingTickets > lottery.MAX_TICKETS){
      message.reply(` you cannot buy more than ${lottery.MAX_TICKETS} tickets`);
      return 0;
    }

    const duration = Math.ceil(Number.parseInt(args[1], 10));
    if (duration > lottery.MAX_DURATION_HOURS || Number.isNaN(ticketCost)) {
      message.reply(` the duration of the lottery must be less than ${lottery.MAX_DURATION_HOURS} hours and be an integer.`);
      return 0;
    }

    if (ticketCost * lottery.INITIAL_NEEDED_TICKETS > user.points.currentPoints) {
      message.reply(` you do not have enough for the base tickets. You must be able to afford ${lottery.INITIAL_NEEDED_TICKETS} tickets at your cost, which would be ${lottery.INITIAL_NEEDED_TICKETS * ticketCost} and you only have $${user.points.currentPoints}.`);
      return 0;
    }

    const lotteries = await getLotteryWithFilter({
      guildID: guild._id,
      isDone: false,
      isQueued: false
    });

    if (lotteries.length > 0) {
      message.reply(' a lottery already exists in this server. You cannot create one until that one is finished.');
      return 0;
    }

    const tickets = [];
    for(let i = 0; i < numStartingTickets; i++){
      tickets.push({
        purchaseDate: moment(),
        userID: user._id,
      });
    }

    await createLottery({
      localityType: lottery.localityType.guild,
      currentJackpot: lottery.INITIAL_NEEDED_TICKETS * ticketCost,
      isQueued: false,
      isDone: false,
      userID: user._id,
      guildID: guild._id,
      createdInChannel: message.channel.id,
      ticketCost,
      minTickets: 0,
      maxTickets: lottery.MAX_TICKETS,
      startDate: moment(),
      endDate: moment().add(duration, 'hours'),
      winner: undefined,
      tickets,
    });

    message.reply(` your lottery has successfully been created. You have purchased ${numStartingTickets} as the number of initial tickets. It will end in ${duration} hours.`);
    return numStartingTickets * ticketCost * -1;
  },
};
