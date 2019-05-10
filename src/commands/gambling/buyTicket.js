const { getLotteryWithFilter, addTickets } = require('../../api/lottery');
const { lottery } = require('../../constants');
const moment = require('moment');

module.exports = {
  name: 'ticket',
  description: 'Buys the given number of lottery tickets for the locality type. Ex: `{0}ticket guild|global 10`',
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
    if(args.length !== 2){
      message.reply(' you must provide the 2 required arguments.');
      return 0;
    }
    const localityType = args[0];

    if(localityType !== 'global' && localityType !== 'guild'){
      message.reply(' please provide the locality type of the lottery as the first argument. (guild or global)');
      return 0;
    }

    const lotteries = await getLotteryWithFilter({
      guildID: guild._id,
      isDone: false,
      isQueued: false
    });

    if(lotteries.length < 1){
      message.reply(` there is no active lottery in this locality.`);
      return 0;
    }

    const numTickets = Number.parseInt(args[1]);

    if(Number.isNaN(numTickets) || numTickets > lottery.MAX_TICKETS || numTickets < 1){
      message.reply(` the number of tickets must be a positive number (not 0) that is less than ${lottery.MAX_TICKETS}`);
      return 0;
    }

    const currentLottery = lotteries[0];
    const currentNumTickets = currentLottery.tickets.filter(x => x.userID === user._id).length;

    if(currentNumTickets + numTickets > currentLottery.maxTickets){
      message.reply(` you can only purchase ${currentLottery.maxTickets} tickets in this lottery. You currently have ${currentNumTickets}. Choose fewer tickets.`);
      return 0;
    }

    if(user.points.currentPoints < currentLottery.ticketCost * numTickets){
      message.reply(` you cannot afford that many tickets. You currently have $${user.points.currentPoints} and would need ${user.points.currentPoints + currentLottery.ticketCost * numTickets}`);
      return 0;
    }

    const tickets = [];
    for(let i = 0; i < numTickets; i++){
      tickets.push({
        purchaseDate: moment(),
        userID: user._id,
      });
    }

    await addTickets(currentLottery._id, {tickets});

    message.reply(` you successfully purchased ${numTickets} tickets!`);
    return currentLottery.ticketCost * numTickets * -1;
  },
};
