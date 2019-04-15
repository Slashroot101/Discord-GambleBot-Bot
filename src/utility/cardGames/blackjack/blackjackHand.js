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
}