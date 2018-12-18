
class Hand {
    constructor(){
        this.cards = new Map();
    }

    addCard(card){
        this.cards.set(card[0], card[1]);
    }

    removeCard(key){
        this.cards.delete(key);
    }

    toString(isBlackjackDealer = false){
        let ret = ``;
        if(!isBlackjackDealer){
            this.cards.forEach(function(key, value, map){
                cardNames.push(key.substr(0, key.indexOf(`|`)))
                ret += `${key.substr(0, key.indexOf('|'))} `;
            });
        } else {
            let cardArray = Array.from(this.cards);
            ret = `${cardArray[0][1]} *`
        }
        return ret;
    }

    getSumOfCards(){
        let sum = 0;
        this.cards.forEach((value, key, map) =>{
            sum += value.value;
        });
        return sum;
    }
}

module.exports = Hand;