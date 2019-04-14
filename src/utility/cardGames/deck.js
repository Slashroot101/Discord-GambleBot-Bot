class Deck {
  constructor(cards, shouldSuffle) {
    this.cards = card;
    if(shouldSuffle){
      this.shuffle();
    }
  }

  drawRandomCard(){
    return this.cards.splice(Math.floor(Math.random() * this.cards.length), 1);
  }

  drawCardOffTop(){
    return this.cards.splice(this.cards.length, 1);
  }

  shuffle(){
    for (let i = this.cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
}
