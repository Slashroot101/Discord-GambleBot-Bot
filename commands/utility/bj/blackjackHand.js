let Hand = require(`../hand`);


class BlackjackHand extends Hand {
    constructor(){
        super();
        this.WIN = 0;
        this.LOSE = 1;
        this.TIE = 2;
        this.BLACKJACK = 3;
        this.BUST = 4;
    }

    isWinner(opponent){
        let opponentSum = opponent.getSumOfCards();
        let thisSum = super.getSumOfCards();
        console.log(12123123123, thisSum)

        if(thisSum > 21){
            return this.BUST;
        }

        if(opponentSum > thisSum && opponentSum < 21){
            return this.LOSE;
        }

        if(thisSum === opponentSum){
            return this.TIE;
        }

        if(thisSum === 21){
            return this.BLACKJACK;
        }

        return this.WIN;
    }

}

module.exports = BlackjackHand;