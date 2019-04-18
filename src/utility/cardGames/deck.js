class Deck {
  constructor(cards, shouldShuffle) {
    this.cards = cards;
    if(shouldShuffle){
      this.shuffle();
    }
  }

  getSumOfCards(){
    return this.cards.reduce((sum, card) => { return sum + card.value });
  }

  drawRandomCard(){
    return this.cards.splice(Math.floor(Math.random() * this.cards.length) - 1, 1);
  }

  drawCardOffTop(){
    return this.cards.splice(0, 1)[0];
  }

  shuffle(){
    for (let i = this.cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}

module.exports = Deck;
