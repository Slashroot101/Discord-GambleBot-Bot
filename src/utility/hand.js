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
    this.cards.forEach((key, value) => {
      ret += `${value[0].substr(0, value[0].indexOf('|'))} `;
    });
    return ret;
  }

  getSumOfCards(isBlackjackDealer = false) {
    let sum = 0;
    if (isBlackjackDealer){
      sum = this.cards.entries().next().value[0][1].value;
    } else {
      this.cards.forEach((value, key) => {
        sum += key[1].value;
      });
    }

    return sum;
  }
}

module.exports = Hand;
