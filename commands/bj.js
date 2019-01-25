const Deck = require(`./utility/deck`);
const BlackjackHand = require(`./utility/bj/blackjackHand`);
const Discord = require('discord.js');
const { addPointsByUserID } = require(`../api/points`);
const currentUsersInGame = new Set();


module.exports = {
	name: 'bj',
	description: 'The game blackjack. Try `!bj 0` to give it a try!',
	hasCooldown: false,
	duration: 10,
	requiresAdmin: false,
	generatesMoney: true,
	usages: 2,
	execute(client, message, args, user) {
		return new Promise(async (resolve, reject) => {
			if (args.length === 0) {
				message.reply('please specify an amount to bet. Such as `!bj <amount>`');
				return resolve();
			}
	
			const bet = Number(parseInt(args[0]));
	
			if(bet < 0){
				message.reply('your bet must be greater than or equal to 0.');
				return resolve();
			}
	
			if(isNaN(bet)){
				message.reply('your bet must be a number.');
				return resolve();
			}
	
			if (user.current_balance < bet) {
				message.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to gain $${bet - user.current_balance} more to make that bet.`);
				return resolve();
			}
	
			if (currentUsersInGame.has(user.id)) {
				message.reply(`you are already in a blackjack game!`);
				return resolve();
			}
			currentUsersInGame.add(user.id);
	
			const gameDeck = new Deck();
			const dealerHand = new BlackjackHand(true);
			const clientHand = new BlackjackHand();
	
			dealerHand
				.addCard(gameDeck.drawRandomCard())
				.addCard(gameDeck.drawRandomCard());
	
			clientHand
				.addCard(gameDeck.drawRandomCard())
				.addCard(gameDeck.drawRandomCard());
	
			const boardMsg = await message.channel.send({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false, false) });
	
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
				boardMsg.edit({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false, false) });
				addPointsByUserID(user.user_id, bet * -1);
			}, 60000);
	
			collector.on('collect', msg => {
				if (msg.content.toLowerCase() === `hit`) {
					clientHand
						.addCard(gameDeck.drawRandomCard());
	
					if (clientHand.getSumOfCards() >= 21) {
						collector.stop();
					}
	
					boardMsg.edit({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false, false) });
				}
	
				if (msg.content.toLowerCase() === `stand`) {
					collector.stop();
					let dealerSum = dealerHand.getSumOfCards();
					while (dealerSum < 17) {
						dealerHand
							.addCard(gameDeck.drawRandomCard());
						dealerSum = dealerHand.getSumOfCards();
					}
					currentUsersInGame.delete(user.id);
					boardMsg.edit({ embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, true, false) });

					
					const isClientWinner = clientHand.isWinner(dealerHand);
					if(isClientWinner === clientHand.BUST ||
						isClientWinner === clientHand.TIE || 
						isClientWinner === clientHand.BLACKJACK ||
						isClientWinner === clientHand.WIN){
						currentUsersInGame.delete(user.id);
					}
		
					if (isClientWinner === clientHand.BLACKJACK || isClientWinner === clientHand.WIN) {
						addPointsByUserID(user.user_id, bet * 1);
						return resolve(bet * 1);
					}
					else if (isClientWinner === clientHand.LOSE || isClientWinner === clientHand.BUST) {
						addPointsByUserID(user.user_id, bet * -1);
						return resolve(bet * -1);
					}
				}


				clearTimeout(gameTimeout);
			});
		});
	},
};