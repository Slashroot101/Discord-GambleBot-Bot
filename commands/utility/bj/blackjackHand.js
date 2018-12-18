
class BlackjackHand extends Hand {
    constructor(){
        super();
    }

    isWinner(opponent){
        let opponentSum = opponent.getSumOfCards();
        let thisSum =  this.getSumOfCard();
        if(opponentSum > thisSum &&  opponentSum <= 21){
            return false;
        }

        if(thisSum > 21){
            return false;
        }

        return true;
    }

}

module.exports = BlackjackHand;