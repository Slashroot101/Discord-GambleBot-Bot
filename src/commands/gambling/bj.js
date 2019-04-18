const currentUsersInGame = new Set();
const Discord = require('discord.js');
const Deck = require('../../utility/cardGames/deck');
const BlackjackHand = require('../../utility/cardGames/blackjack/blackjackHand');
const Cards = require('../../utility/cardGames/cards');
const BlackjackCards = [...Cards, ...Cards, ...Cards];

module.exports = {
  name: 'bj',
  description: 'Starts a game of blackjack. Try `!bj 0` to give it a try',
  costData: {
    cost: 1,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: false,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Gambling',
  allowedRoles: [
  ],
  async execute(client, msg, args, user) {
    if (args.length === 0) {
      return msg.reply('please specify an amount to bet. Such as `!bj <amount>`');
    }

    const bet = Number(parseInt(args[0], 10));

    if (bet < 0) {
      return msg.reply('your bet must be greater than or equal to 0.');
    }

    if (Number.isNaN(bet) || bet > Number.MAX_SAFE_INTEGER || bet < Number.MIN_SAFE_INTEGER) {
      return msg.reply(`your bet must be a number that does not go over ${Number.MAX_SAFE_INTEGER} and does not go below ${Number.MIN_SAFE_INTEGER}.`);
    }

    if (user.points.currentPoints < bet) {
      return msg.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to gain $${bet - user.current_balance} more to make that bet.`);
    }

    if (currentUsersInGame.has(user.id)) {
      return msg.reply('you are already in a blackjack game!');
    }

    currentUsersInGame.add(user._id);

    const gameDeck = new Deck(BlackjackCards, true);
    const dealerHand = new BlackjackHand([gameDeck.drawCardOffTop(), gameDeck.drawCardOffTop()], true);
    const clientHand = new BlackjackHand([gameDeck.drawCardOffTop(), gameDeck.drawCardOffTop()], false);
    const boardMsg = await msg.channel.send({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, false, true)});

    if (clientHand.getSumOfCards() === 21) {
      currentUsersInGame.delete(user._id);
      return bet;
    }

    const betCollector = new Discord.MessageCollector(
      msg.channel,
      m => m.author.id === msg.author.lastMessageID,
      {time: 60000},
    );
  },
};
