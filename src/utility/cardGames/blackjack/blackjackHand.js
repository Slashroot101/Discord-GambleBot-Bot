const messageConstants = require('./messageConstants');

class BlackjackHand extends Hand {
	constructor(cards, isDealer){
		super(cards);
		this.WIN = 0;
		this.LOSE = 1;
		this.TIE = 2;
		this.BLACKJACK = 3;
		this.BUST = 4;
		this.CONTINUEGAME = 5;
		this.isDealer = isDealer;
	}

	toString(onlyShowFirst){
		return onlyShowFirst && this.isDealer ? this.cards[0] : this.cards.map(card => card.name).join(' ');
	}

	isWinner(opponent, isStand){
			const opponentSum = opponent.getSumOfCards();
			const thisHandSum = super.getSumOfCards();
			if(thisHandSum > 21){
				return this.BUST;
			}

			if(opponentSum > 21){
				return this.BUST;
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

			if(opponentSum === 21){
				return this.LOSE;
			}

			if(thisHandSum === 21){
				return this.BLACKJACK;
			}

			return this.CONTINUEGAME;
	}

	toGameboardEmbed(discordUser, opponentHand, isStand, isFirst){
		const isUserWinner = this.isWinner(opponentHand, isStand);
		let dealerSum = opponentHand.getSumOfCards();
		let clientSum = this.getSumOfCards();
		let resultText = messageConstants[isUserWinner].text;
		let clientHandString = this.toString();
		let dealerHandString = opponentHand.toString(isFirst);
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
