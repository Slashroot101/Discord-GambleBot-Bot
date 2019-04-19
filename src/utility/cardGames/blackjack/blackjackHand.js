const messageConstants = require('./messageConstants');
const Hand = require('../hand');

class BlackjackHand extends Hand {
	constructor(cards, isDealer){
		super(cards);
		this.WIN = 1;
		this.LOSE = 2;
		this.TIE = 6;
		this.BLACKJACK = 3;
		this.BUST = 4;
		this.CONTINUEGAME = 5;
		this.isDealer = isDealer;
	}

	getSumOfCards(hideFirstDealerCard) {
		return hideFirstDealerCard ? this.cards[0].value : super.getSumOfCards();
	}

	isWinner(opponent, isStand){
			const opponentSum = opponent.getSumOfCards();
			const thisHandSum = this.getSumOfCards();
		  console.log(isStand, opponentSum, thisHandSum)
			if(thisHandSum > 21){
				return this.BUST;
			}

			if(opponentSum > 21){
				return this.WIN;
			}

			if(thisHandSum === opponentSum && (isStand || thisHandSum === 21)){
				const thisNumCards = this.getCards().length;
				const opponentNumCards = opponent.getCards().length;
				if(thisNumCards < opponentNumCards){
					return this.WIN;
				}

				if(thisNumCards === opponentNumCards){
					return this.TIE;
				}
			}

			if(isStand){
				if(opponentSum > thisHandSum && opponentSum <= 21){
					return this.LOSE;
				} else if (opponentSum < thisHandSum && thisHandSum <= 21) {
					return this.WIN;
				}
			}

			if(opponentSum === 21){
				return this.LOSE;
			}

			if(thisHandSum === 21){
				return this.BLACKJACK;
			}

			return this.CONTINUEGAME;
	}

	toString(onlyShowFirst){
		return onlyShowFirst && this.isDealer ? `${this.cards[0].getName()} **` : this.cards.map(card => card.name).join(' ');
	}

	toGameboardEmbed(discordUser, opponentHand, isStand, hideFirstDealerCard){
		const isUserWinner = this.isWinner(opponentHand, isStand);
		let dealerSum = opponentHand.getSumOfCards(hideFirstDealerCard);
		let clientSum = this.getSumOfCards(false);
		let resultText = messageConstants[isUserWinner].text;
		let clientHandString = this.toString(false);
		let dealerHandString = opponentHand.toString(hideFirstDealerCard);
		let color = messageConstants[isUserWinner].color;

		return {
			color,
			author: {
				name: discordUser.tag,
				icon_url: discordUser.avatarURL,
			},
			title: '',
			url: '',
			description: `${resultText}`,
			fields: [
				{
					name: '**Your Hand**',
					value: `${clientHandString}`,
					inline: true,
				},
				{
					name: '**Dealer Hand**',
					value: `${dealerHandString}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				},
				{
					name: '\u200b',
					value: `Value: ${clientSum}`,
					inline: true,
				},
				{
					name: '\u200b',
					value: `Value: ${dealerSum} `,
					inline: true,
				},
				{
					name: '\u200b',
					value: '\u200b',
					inline: true,
				},
			],
			timestamp: new Date(),
		};
  }
}

module.exports = BlackjackHand;
