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

        let done = false;
        
        dealerHand
            .addCard(gameDeck.drawRandomCard())
            .addCard(gameDeck.drawRandomCard());

        clientHand
            .addCard(gameDeck.drawRandomCard())
            .addCard(gameDeck.drawRandomCard());

        let boardMsg = await message.channel.send({embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false)});

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        
        collector.on('collect', msg => {
            if(done){ return; }
            if(msg.content === `hit`){
                clientHand
                    .addCard(gameDeck.drawRandomCard());

                
                if(clientHand.getSumOfCards() >= 21){
                    done = true;
                }

               return boardMsg.edit({embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, false)});
            }

            if(msg.content === `stand`){
                if(done){ return; }
                    dealerSum = dealerHand.getSumOfCards();  
                    while(dealerSum < 17){
                        dealerHand
                            .addCard(gameDeck.drawRandomCard());
                        dealerSum = dealerHand.getSumOfCards();     
                    }
                    done = true;
                    return boardMsg.edit({embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, true)});
            }
        });


    }
}