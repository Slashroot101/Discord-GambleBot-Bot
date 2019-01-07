const Deck = require(`./utility/deck`);
const BlackjackHand = require(`./utility/bj/blackjackHand`);
const Discord = require('discord.js');
const { addPointsByUserID } = require(`../api/points`);
const currentUsersInGame = new Set();

module.exports = {
	name: 'bj',
	description: 'Blackjack',
	duration: 1,
	usages: 2,
	async execute(client, message, args, user) {
		if (args.length === 0) {
			return message.reply('please specify an amount to bet. Such as `!bj <amount>`');
		}

		const bet = Number(parseInt(args[0]));

		if (user.current_balance < bet) {
			return message.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to withdraw ${bet - user.current_balance} more to make that bet.`);
		}

		if (currentUsersInGame.has(user.id)) {
			return message.reply(`you are already in a blackjack game!`);
		}

		currentUsersInGame.add(user.id);

		const gameDeck = new Deck();
		const dealerHand = new BlackjackHand();
		const clientHand = new BlackjackHand();
		let done = false;

		dealerHand
			.addCard(gameDeck.drawRandomCard())
			.addCard(gameDeck.drawRandomCard());

		clientHand
			.addCard(gameDeck.drawRandomCard())
			.addCard(gameDeck.drawRandomCard());

		const boardMsg = await message.channel.send({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false) });

		if (clientHand.getSumOfCards() === 21) {
			currentUsersInGame.delete(user.id);
			return;
		}

		const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });

		const gameTimeout = setTimeout(function() {
			currentUsersInGame.delete(user.id);
			clientHand
				.addCard(gameDeck.drawRandomCard())
				.addCard(gameDeck.drawRandomCard())
				.addCard(gameDeck.drawRandomCard())
				.addCard(gameDeck.drawRandomCard())
				.addCard(gameDeck.drawRandomCard());
			boardMsg.edit({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false) });
			addPointsByUserID(user.user_id, bet * -1);
		}, 60000);

		collector.on('collect', msg => {
			if (done) {
				return;
			}
			if (msg.content === `hit`) {
				clientHand
					.addCard(gameDeck.drawRandomCard());

				const isClientWinner = clientHand.isWinner(dealerHand);
				if (isClientWinner === clientHand.BLACKJACK) {
					addPointsByUserID(user.user_id, bet * 1);
				}
				else if (isClientWinner === clientHand.BUST) {
					addPointsByUserID(user.user_id, bet * -1);
				}

				if (clientHand.getSumOfCards() >= 21) {
					done = true;
				}
				clearTimeout(gameTimeout);
				currentUsersInGame.delete(user.id);
				return boardMsg.edit({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false) });
			}

			if (msg.content === `stand`) {
				if (done) {
					return;
				}
				let dealerSum = dealerHand.getSumOfCards();
				while (dealerSum < 17) {
					dealerHand
						.addCard(gameDeck.drawRandomCard());
					dealerSum = dealerHand.getSumOfCards();
				}
				done = true;

				const isClientWinner = clientHand.isWinner(dealerHand);
				if (isClientWinner === clientHand.BLACKJACK || isClientWinner === clientHand.WIN) {
					addPointsByUserID(user.user_id, bet * 1);
				}
				else if (isClientWinner === clientHand.LOSE || isClientWinner === clientHand.BUST) {
					addPointsByUserID(user.user_id, bet * -1);
				}
				clearTimeout(gameTimeout);
				currentUsersInGame.delete(user.id);
				return boardMsg.edit({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, true) });
			}
		});
	},
};
