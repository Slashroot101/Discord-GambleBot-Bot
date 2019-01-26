const Hand = require('../hand');


class BlackjackHand extends Hand {
	constructor(isDealer) {
		super();
		this.WIN = 0;
		this.LOSE = 1;
		this.TIE = 2;
		this.BLACKJACK = 3;
		this.BUST = 4;
		this.CONTINUEGAME = 5;
		this.isDealer = isDealer;
	}

	toString(isStanding){
		let ret = '';
		let count = 0;
		if(this.isDealer && isStanding){
			this.cards.forEach((value, key) => {
				ret += `${count === 0 ? `${key[0].substr(0, key[0].indexOf('|'))} *` : ''}`
				count++;
			});
			return ret;
		}

		this.cards.forEach((value, key) => {
			ret += `${key[0].substr(0, key[0].indexOf('|'))} `
		});
		return ret;
	}

	isWinner(opponent, isStand) {
		const opponentSum = opponent.getSumOfCards();
		const thisSum = super.getSumOfCards();
		if(opponentSum > 21){
			return this.WIN;
		}

		if(thisSum > 21) {
			return this.BUST;
		}

		if(thisSum === 21) {
			return this.BLACKJACK;
		}

		if(opponentSum === 21) {
			return this.LOSE;
		}

		if(isStand){
			if(opponentSum > thisSum && opponentSum < 21) {
				return this.LOSE;
			}
	
			if(thisSum === opponentSum) {
				if(thisSum === 21 && opponentSum === 21) {
					if(this.cards.size > opponent.cards.size) {
						return this.LOSE;
					}
					return this.WIN;
				}
			}

			if(opponentSum === 21) {
				return this.LOSE;
			}

			if(thisSum === 21) {
				return this.BLACKJACK;
			}
	
			return this.WIN;
		}


		return this.CONTINUEGAME;
	}

	static toGameboardEmbedObject(clientHand, dealerHand, message, isStand) {
		const isClientWinner = clientHand.isWinner(dealerHand, isStand);
		let dealerSum;
		let clientSum;
		let result;
		let clientHandString;
		let dealerHandString;
		let color;


		if(isClientWinner === clientHand.BLACKJACK) {
			clientSum = 21;
			dealerSum = dealerHand.getSumOfCards();
			dealerHandString = dealerHand.toString();
			clientHandString = clientHand.toString();
			result = 'Result: Blackjack';
			color = 0x00ff00;
		}
		else if(isClientWinner === clientHand.BUST || (isClientWinner === clientHand.LOSE && isStand)) {
			dealerSum = dealerHand.getSumOfCards();
			clientSum = clientHand.getSumOfCards();
			dealerHandString = dealerHand.toString();
			clientHandString = clientHand.toString();
			result = 'You lose';
			color = 15158332;
		}
		else if(isClientWinner === clientHand.WIN && isStand) {
			dealerSum = dealerHand.getSumOfCards();
			clientSum = clientHand.getSumOfCards();
			dealerHandString = dealerHand.toString();
			clientHandString = clientHand.toString();
			result = 'You win';
			color = 0x00ff00;
		} else if (isClientWinner === clientHand.TIE){
			dealerSum = dealerHand.getSumOfCards();
			clientSum = clientHand.getSumOfCards();
			dealerHandString = dealerHand.toString();
			clientHandString = clientHand.toString();
			result = 'Tie, money is pushed back';
			color = 0xD3D3D3;
		} else {
			dealerSum = dealerHand.getSumOfCards(true);
			clientSum = clientHand.getSumOfCards();
			dealerHandString = dealerHand.toString(true);
			clientHandString = clientHand.toString();
			result = 'Type `hit` to draw another card or `stand` to pass.';
			color = 3447003;
		}

		const embed = {
			color,
			author: {
				name: message.member.user.tag,
				icon_url: message.member.user.avatarURL,
			},
			title: '',
			url: '',
			description: `${result}`,
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

		return embed;
	}

}

module.exports = BlackjackHand;