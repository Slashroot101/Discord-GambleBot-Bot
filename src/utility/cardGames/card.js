const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];

class Card {
  constructor(suit, value, name) {
    if(!suits.includes(suit)){
      throw new Error('Suit is not of hearts, spades, clubs, or diamonds');
    }

    if(value < 1 || value > 12){
      throw new Error('Card value is too high. Must be between 2 and 12');
    }
    this.suit = suit;
    this.value = value;
    this.name = name;
  }

  getValue(){
    return this.value;
  }

  getName(){
    return this.name;
  }
}

module.exports = Card;
