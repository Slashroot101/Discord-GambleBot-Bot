let Deck = require(`./utility/deck`);
let BlackjackHand = require(`./utility/bj/blackjackHand`);
const Discord = require('discord.js');
let board = require(`./utility/bj/board`);

module.exports = {
    name: 'bj',
    description: 'Blackjack',
    async execute(client, message, args, user) {
        let gameDeck = new Deck();

        let dealerHand = new BlackjackHand();
        let clientHand = new BlackjackHand();

        let bust = false;
        
        dealerHand
            .addCard(gameDeck.drawRandomCard())
            .addCard(gameDeck.drawRandomCard());

        clientHand
            .addCard(gameDeck.drawRandomCard())
            .addCard(gameDeck.drawRandomCard());

        let dealerSum = dealerHand.getSumOfCards();
        let clientSum = clientHand.getSumOfCards();

        let isClientWinner = clientHand.isWinner(dealerHand);

        if(isClientWinner === clientHand.BLACKJACK){
            let boardProperties = {
                clientString: clientHand.toString(),
                clientSum,
                dealerString: dealerHand.toString(),
                result: `Blackjack`,
                dealerSum,
                color: 15158332
            }

            message.channel.send(board.gameBoard(message, boardProperties));
        }

        let boardProperties = {
            clientString: clientHand.toString(),
            clientSum,
            dealerString: dealerHand.toString(true),
            dealerSum,
            color: 15158332
        }

        let boardMsg = await message.channel.send(board.gameBoard(message, boardProperties));

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        
        collector.on('collect', msg => {
            if(bust === true){ return; }
            if(msg.content === `hit`){
                clientHand
                    .addCard(gameDeck.drawRandomCard());
                clientSum = clientHand.getSumOfCards();
                isClientWinner = clientHand.isWinner(dealerHand);
                if(isClientWinner === clientHand.BLACKJACK){
                    bust = true;
                    let boardProperties = {
                        clientString: clientHand.toString(),
                        clientSum,
                        dealerString: dealerHand.toString(),
                        result: `Blackjack`,
                        dealerSum,
                        color: 15158332
                    }
        
                   return boardMsg.edit(board.winnerBoard(message, boardProperties));
                }

                if(isClientWinner === clientHand.BUST){
                    let embedText = {
                        clientString: clientHand.toString(),
                        clientSum,
                        dealerString: dealerHand.toString(),
                        dealerSum,
                        result: `You lost`,
                        color: 15158332
                    };
                   return boardMsg.edit(board.winnerBoard(message, embedText));
                }

                let boardProperties = {
                    clientString: clientHand.toString(),
                    clientSum,
                    dealerString: dealerHand.toString(true),
                    dealerSum,
                    color: 15158332
                }
    
               return boardMsg.edit(board.gameBoard(message, boardProperties));

            }

            if(msg.content === `stand`){

            }
        });


    }
}