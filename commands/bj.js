let {getSumOfMap, getRandomIndex} = require(`./utility/bj/bj`);
let {cards} = require(`./utility/bj/cards`);
const Discord = require('discord.js');

module.exports = {
    name: 'bj',
    description: 'Blackjack',
    execute(client, message, args) {
        let deck = new Map(cards);

        //dealer
        let dCard1 = getRandomIndex(deck);
        deck.delete(dCard1[0]);
        let dCard2 = getRandomIndex(deck);
        deck.delete(dCard2);

        //client
        let cCard1 = getRandomIndex(deck);
        deck.delete(cCard1[0]);
        let cCard2 = getRandomIndex(deck);
        deck.delete(cCard2);

        let clientHand = [cCard1, cCard2];
        let dealerHand = [dCard1, dCard2];
        message.channel.send({embed: {
            color: 3447003,
            author: {
              name: message.member.user.tag,
              icon_url: message.member.user.avatarURL
            },
            title: "",
            url: "",
            description: "Type `hit` to draw another card or `stand` to pass.",
            fields: [
              {
                name: "**Your Hand**",
                value: `${cCard1[0].substr(0, cCard1[0].indexOf(`|`))} ${cCard2[0].substr(0, cCard2[0].indexOf(`|`))}`,
                inline: true
              },
              {
                name: "**Dealer Hand**",
                value: `${dCard1[0].substr(0, dCard1[0].indexOf(`|`))} ${dCard2[0].substr(0, dCard2[0].indexOf(`|`))}`,
                inline: true
              },
              {
                name: "\u200b",
                value: `\u200b`,
                inline: true
              },
              {
                name: "\u200b",
                value: `Value: ${getSumOfMap(clientHand)}`,
                inline: true
              },
              {
                name: "\u200b",
                value: `Value: ${getSumOfMap(dealerHand)} `,
                inline: true
              }
            ],
            timestamp: new Date()
          }
        });

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

        collector.on('collect', msg => {
            if(msg.content === `hit`){
                console.log(`hit`)
            } else if (msg.content === `stand`){

            }
        });
    }
};