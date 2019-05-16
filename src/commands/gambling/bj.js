const currentUsersInGame = new Set();
const Discord = require('discord.js');
const Deck = require('../../utility/cardGames/deck');
const BlackjackHand = require('../../utility/cardGames/blackjack/blackjackHand');
const Cards = require('../../utility/cardGames/cards');
const BlackjackCards = [...Cards, ...Cards, ...Cards];
const GAME_TIME = 60000;

module.exports = {
  name: 'bj',
  description: 'Starts a game of blackjack. Try `{0}bj 0` to give it a try',
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
  async execute(client, msg, args, user) {
    return new Promise(async resolve => {
      if (args.length === 0) {
        return msg.reply('please specify an amount to bet. Such as `!bj <amount>`');
      }

      let bet = Number(parseInt(args[0], 10));

      if (bet < 0) {
        return msg.reply('your bet must be greater than or equal to 0.');
      }

      if (Number.isNaN(bet) || bet > Number.MAX_SAFE_INTEGER || bet < Number.MIN_SAFE_INTEGER) {
        return msg.reply(`your bet must be a number that does not go over ${Number.MAX_SAFE_INTEGER} and does not go below ${Number.MIN_SAFE_INTEGER}.`);
      }

      if (user.points.currentPoints < bet && bet !== 0) {
        return msg.reply(`you do not have enough money! You currently have ${user.points.currentPoints}, and would need to gain $${bet - user.points.currentPoints} more to make that bet.`);
      }

      if (currentUsersInGame.has(user.id)) {
        return msg.reply('you are already in a blackjack game!');
      }

      currentUsersInGame.add(user._id);

      const gameDeck = new Deck(BlackjackCards, true);
      const dealerHand = new BlackjackHand([gameDeck.drawCardOffTop(), gameDeck.drawCardOffTop()], true);
      const clientHand = new BlackjackHand([gameDeck.drawCardOffTop(), gameDeck.drawCardOffTop()], false);

      if (clientHand.getSumOfCards() === 21) {
        currentUsersInGame.delete(user._id);
        return bet;
      }

      const boardMsg = await msg.channel.send({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, clientHand.getSumOfCards() === 21, true)});
      let gameTimeout = setTimeout(async () => {
        currentUsersInGame.delete(user._id);
        clientHand
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop())
          .addCard(gameDeck.drawCardOffTop());
        await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, false, false)});
		betCollector.stop();
		resolve(bet * -1);
      }, GAME_TIME);

      const betCollector = new Discord.MessageCollector(
        msg.channel,
        m => m.author.id === msg.author.id,
        {time: GAME_TIME},
      );

      betCollector.on('collect', async msg => {
        let isStand = false;
        if(msg.content.toLowerCase() === 'hit'){
          clientHand.addCard(gameDeck.drawCardOffTop());
          await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, false, true)});
        }

        if(msg.content.toLowerCase() === 'stand' || msg.content.toLowerCase() === 'double'){
          if(msg.content.toLowerCase() === 'double' && dealerHand.cards.length === 2){
            bet *= 2;
            clientHand.addCard(gameDeck.drawCardOffTop());
          }
          isStand = true;
          let dealerSum = dealerHand.getSumOfCards();
          while(dealerSum < 17){
            dealerHand.addCard(gameDeck.drawCardOffTop());
            dealerSum = dealerHand.getSumOfCards();
          }
          await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, true, false)});
        }

        const isWinner = clientHand.isWinner(dealerHand, isStand);
        if(isWinner === clientHand.BUST
          || isWinner === clientHand.TIE
          || isWinner === clientHand.BLACKJACK
          || isWinner === clientHand.WIN
          || isWinner === clientHand.LOSE){
          betCollector.stop();
          let embed = clientHand.toGameboardEmbed(msg.member.user, dealerHand, true, isWinner === clientHand.CONTINUEGAME);
          embed.description = embed.description.replace('${0}', bet);
          await boardMsg.edit({embed});
          currentUsersInGame.delete(user._id);
          clearTimeout(gameTimeout);

          if(isWinner === clientHand.TIE){
            return (0);
          }

          if(isWinner === clientHand.WIN
            || isWinner === clientHand.BLACKJACK){
            return resolve(bet);
          }

          if(isWinner === clientHand.BUST
            || isWinner === clientHand.LOSE){
            return resolve(bet * -1);
          }
        }

        await boardMsg.edit({embed: clientHand.toGameboardEmbed(msg.member.user, dealerHand, false, isWinner === clientHand.CONTINUEGAME)});
      });
    });
  },
};
