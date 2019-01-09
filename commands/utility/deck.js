const { cards } = require('./cards');

class Deck {
	constructor() {
		this.deck = Array.from(new Map(cards));
		this.shuffle();
		this.deck = Deck.createHashMapFromArray(this.deck);
	}

	drawRandomCard() {
		const tempDeck = Array.from(this.deck);
		const randomCard = tempDeck.splice(Math.floor(Math.random() * tempDeck.length), 1);
		this.deck = Deck.createHashMapFromArray(tempDeck);
		return randomCard;
	}

	shuffle() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}

	static createHashMapFromArray(arr) {
		const hashMap = new Map();
		for(let i = 0; i < arr.length; i++) {
			hashMap.set(arr[i][0], arr[i][1]);
		}
		return hashMap;
	}

}

module.exports = Deck;