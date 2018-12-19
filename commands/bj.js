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
        
        dealerHand
            .addCard(gameDeck.drawRandomCard())
            .addCard(gameDeck.drawRandomCard());

        clientHand
            .addCard(gameDeck.drawRandomCard())
            .addCard(gameDeck.drawRandomCard());


        console.log(clientHand.cards) 
        let dealerSum = dealerHand.getSumOfCards();
        let clientSum = clientHand.getSumOfCards();

        let isClientWinner = clientHand.isWinner(dealerHand);

        let boardProperties = {
            clientString: clientHand.toString(),
            clientSum,
            dealerString: isClientWinner === clientHand.WIN ? dealerHand.toString() : dealerHand.toString(true),
            dealerSum,
            color: 15158332
        }

        message.channel.send(board.gameBoard(message, boardProperties));

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        
        collector.on('collect', msg => {
            if(msg.content === `hit`){

            }

            if(msg.content === `stand`){

            }
        });


    }
}