
class Hand {
    constructor(){
        this.cards = new Map();
    }

    addCard(card){
        this.cards.set(card[0], card[1]);
        return this;
    }

    removeCard(key){
        this.cards.delete(key);
    }

    toString(isBlackjackDealer = false){
        let ret = ``;
        if(!isBlackjackDealer){
            this.cards.forEach(function(key, value, map){
                ret += `${value[0].substr(0, value[0].indexOf('|'))} `;
            });
        } else {
            let count = 0;
            this.cards.forEach(function(key, value, map){
                if(count < 1){
                    count++;
                    console.log(value[0].substr(0, value[0].indexOf('|')))
                    ret += `${value[0].substr(0, value[0].indexOf('|'))} `;
                }
            });
            ret += ` *`
        }
        return ret;
    }

    getSumOfCards(){
        let sum = 0;
        this.cards.forEach((value, key, map) =>{
            sum += key[1].value;
        });
        return sum;
    }
}

module.exports = Hand;