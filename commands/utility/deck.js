let {cards} = require(`./cards`);

class Deck {
    constructor(){
        this.deck = Array.from(new Map(cards));
        this.shuffle();
        this.deck = Deck.createHashMapFromArray(this.deck);
    }

    drawRandomCard(){
        let tempDeck = Array.from(this.deck);
        let randomCard = tempDeck.splice(Math.floor(Math.random() * tempDeck.length), 1);
        this.deck = Deck.createHashMapFromArray(tempDeck);
        return randomCard;
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
            console.log(arr)
            hashMap.set(arr[i][0], arr[i][1]);
        }
        return hashMap;
    }
    
}

module.exports = Deck;