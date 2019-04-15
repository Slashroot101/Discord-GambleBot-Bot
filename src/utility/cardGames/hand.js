class Hand {
  constructor(cards){
    this.cards = cards;
  }

  addCard(card){
    if(!(card instanceof Card)){
      throw new Error('Card must be an instance of the card class.');
    }
    this.cards.push(card);
  }

  toString(){
    return this.cards.map(card => card.name).join(' ');
  }

  removeCard(card){
    if(!(card instanceof Card)){
      throw new Error('Card must be an instance of the card class.');
    }
    const indexOfCard = this.cards.map(cardElement => `${cardElement.suit}|${cardElement.value}`).indexOf(`${card.suit}|${card.value}`);
    return this.cards.splice(indexOfCard, 1);
  }

  getSumOfCards(){
    return this.cards.reduce((sum, card) => { return sum + card.value });
  }
}
