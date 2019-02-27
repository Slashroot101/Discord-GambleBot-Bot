class Hand {
  constructor() {
    this.cards = new Map();
  }

  addCard(card) {
    this.cards.set(card[0], card[1]);
    return this;
  }

  removeCard(key) {
    this.cards.delete(key);
  }

  toString() {
    let ret = '';
    this.cards.forEach((key, value, map) => {
      ret += `${value[0].substr(0, value[0].indexOf('|'))} `;
    });
    return ret;
  }

  getSumOfCards(isBlackjackDealer = false) {
    let sum = 0;
    let count = 0;
    this.cards.forEach((value, key, map) => {
      if (isBlackjackDealer && count < 1) {
        sum = key[1].value;
        count++;
      } else if (!isBlackjackDealer) {
        sum += key[1].value;
      }
    });
    return sum;
  }
}

module.exports = Hand;
