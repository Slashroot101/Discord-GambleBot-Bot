let {cards} = require(`./cards`);

class Deck {
    constructor(){
        this.deck = Array.from(new Map(cards));
        this.shuffle();
        this.deck = Hand.createHashMapFromArray(this.deck);
        console.log(this.deck)
        this.hand = new Map();
    }

    drawRandomCard(){
        return this.deck.splice(Math.floor(Math.random() * this.deck.length), 1);
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    static createHashMapFromArray(arr){
        let hashMap = new Map();
        for(let i = 0; i < arr.length; i++){
            hashMap.set(arr[i][0], arr[i][1]);
        }
        return hashMap;
    }
    
}

module.exports = Deck;