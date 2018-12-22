let Deck = require(`./utility/deck`);
let BlackjackHand = require(`./utility/bj/blackjackHand`);
const Discord = require('discord.js');
const {addPointsByUserID} = require(`../api/points`);

module.exports = {
    name: 'bj',
    description: 'Blackjack',
    async execute(client, message, args, user) {
        console.log(currentUsersInGame.has(user.user_id))

        if(args.length === 0){
            return message.reply('please specify an amount to bet. Such as `!bj <amount>`');
        }

        if(currentUsersInGame.has(user.user_id)){
            return message.reply('you already are in a game of blackjack');
        }

        let bet = Number(args[0]);

        if(user.current_balance < bet){
            return message.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to withdraw ${bet-user.current_balance} more to make that bet.`);
        }

        currentUsersInGame.add(user.user_id);
        console.log(currentUsersInGame)
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

        if(clientHand.getSumOfCards() === 21){
            return;
        }

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        
        setTimeout(function(){
            currentUsersInGame.delete(user.user_id);
        })

        collector.on('collect', msg => {
            if(done){ return; }
            if(msg.content === `hit`){
                clientHand
                    .addCard(gameDeck.drawRandomCard());

                let isClientWinner = clientHand.isWinner(dealerHand);
                console.log(isClientWinner)
                if(isClientWinner === clientHand.BLACKJACK){
                    addPointsByUserID(user.user_id, bet * 1);
                } else if (isClientWinner === clientHand.BUST){
                    addPointsByUserID(user.user_id, bet * -1);
                }

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

                    let isClientWinner = clientHand.isWinner(dealerHand);
                    if(isClientWinner === clientHand.BLACKJACK || isClientWinner === clientHand.WIN){
                        addPointsByUserID(user.user_id, bet * 1);
                    } else if (isClientWinner === clientHand.LOSE || isClientWinner === clientHand.BUST){
                        addPointsByUserID(user.user_id, bet * -1);
                    }

                    return boardMsg.edit({embed: BlackjackHand.toGameboardEmbedObject(clientHand, dealerHand, message, true)});
            }
        });


    }
}