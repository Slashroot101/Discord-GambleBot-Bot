const { create: createLottery } = require('../api/lottery');
const { INITIAL_NEEDED_TICKETS, MAX_DURATION_HOURS, MAX_TICKETS } = require('./utility/constants/lottery');
const { create: createLotteryTickets } = require('../api/lotteryTickets');
const localityTypes = require('./utility/constants/localityTypes');
const { getByGuildID: getGuildByGuildID } = require('../api/guild');
const { addPointsByUserID } = require('../api/points');

module.exports = {
  name: 'lottery',
  description: 'Creates a lottery in the guild. You MUST have enough for 5 tickets to begin. Try `!lottery <ticketCost> <durationInHours>` to begin!',
  requiresAdmin: false,
  duration: 1,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  async execute(client, message, args, user) {
    if (args.length !== 2) {
      message.reply(' you must provide 2 arguments. Ex: `!lottery 250 2`');
      return;
    }

    const ticketCost = Number.parseInt(args[0], 10);
    if (ticketCost < 1 || Number.isNaN(ticketCost)) {
      message.reply(' the ticket cost cannot be 0 or negative. It must be an integer.');
    }

    const duration = Math.ceil(Number.parseInt(args[1], 10));
    if (duration > MAX_DURATION_HOURS || Number.isNaN(ticketCost)) {
      message.reply(` the duration of the lottery must be less than ${MAX_DURATION_HOURS} hours and be an integer.`);
      return;
    }

    if (ticketCost * INITIAL_NEEDED_TICKETS > user.current_balance) {
      message.reply(` you do not have enough for the base tickets. You must be able to afford ${INITIAL_NEEDED_TICKETS} tickets at your cost, which would be ${INITIAL_NEEDED_TICKETS * ticketCost} and you only have $${user.current_balance}.`);
      return;
    }

    const guild = await getGuildByGuildID(message.guild.id);
    const lottery = {
      localityType: localityTypes.guild,
      guildID: guild.id,
      duration,
      ticketCost,
      maxTickets: MAX_TICKETS,
      isDone: false,
    };

    const createdLottery = await createLottery(lottery);
    if (createdLottery.lottery.id === undefined) {
      message.reply(' a lottery already exists in this server. You cannot create one until that one is finished.');
      return;
    }
    await createLotteryTickets(createdLottery.lottery.id, INITIAL_NEEDED_TICKETS, user.user_id);
    await addPointsByUserID(user.user_id, guild.id, INITIAL_NEEDED_TICKETS * ticketCost * -1);
    message.reply(` your lottery has succesfully been created. You have purchased ${INITIAL_NEEDED_TICKETS} as the required amount of initial tickets`);
  },
};
