
// let {cards} = require(`./utility/bj/cards`);
// let {gameBoard, winnerBoard} = require(`./utility/bj/board.js`);
// let {getRandomIndex, getSumOfMap, createCardString} = require(`./utility/bj/bj`);
// const Discord = require('discord.js');










// module.exports = {
//     name: 'bj',
//     description: 'Blackjack',
//     async execute(client, message, args, user) {
//         let deck = new Map(cards);
//         console.log(args)
//         //dealer
//         let dCard1 = getRandomIndex(deck);
//         deck.delete(dCard1[0]);
//         let dCard2 = getRandomIndex(deck);
//         deck.delete(dCard2);

//         //client
//         let cCard1 = getRandomIndex(deck);
//         deck.delete(cCard1[0]);
//         let cCard2 = getRandomIndex(deck);
//         deck.delete(cCard2[0]);

//         let clientHand = [cCard1, cCard2];
//         let dealerHand = [dCard1, dCard2];
//         let dealerSum = getSumOfMap(dealerHand);
//         let clientSum = getSumOfMap(clientHand);

//         let board;
//         if(dealerSum === 21){``
//           let embedText = {
//             clientString: createCardString(clientHand),
//             clientSum,
//             dealerString: createCardString(dealerHand),
//             dealerSum,
//             result: `You lost`,
//             color: 15158332
//           };
//           return message.channel.send(winnerBoard(message, embedText));
//         } else if (clientSum === 21){
//           let embedText = {
//             clientString: createCardString(clientHand),
//             clientSum,
//             dealerString: createCardString(dealerHand),
//             dealerSum,
//             result: `You win`,
//             color: 0x00FF00
//           };
//           return board.edit(winnerBoard(message, embedText));
//         } else {
//           let embedText = {
//             clientString: createCardString(clientHand),
//             clientSum,
//             dealerString: `${dealerHand[0][0].substr(0, dealerHand[0][0].indexOf(`|`))} **`,
//             dealerSum: dealerHand[0][1].value,
//             color: 3447003
//           };
//           board = await message.channel.send(gameBoard(message, embedText));
//         }

//         const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });

//         let bust = 0;
//         /**
//          * 1 = lose
//          * 2 = win
//          * 3 = tie
//          */
//         collector.on('collect', msg => {
//           if(bust === 0){
//             if(msg.content === `hit`){
//               let newCard = getRandomIndex(deck);
//               deck.delete(newCard[0]);
//               clientHand.push(newCard);
//               clientSum = getSumOfMap(clientHand);
//               if(clientSum > 21 || dealerSum === 21){
//                 bust = 1;
//               } else if(clientSum === 21){
//                 bust = 2;
//               } else {
//                 bust = 0;
//                 let embedText = {
//                   clientString: createCardString(clientHand),
//                   clientSum,
//                   dealerString: `${dealerHand[0][0].substr(0, dealerHand[0][0].indexOf(`|`))} **`,
//                   dealerSum : dealerHand[0][1].value,
//                   color: 3447003
//                 };
//                 board.edit(gameBoard(message, embedText));
//               }
//             } else if (msg.content === `stand`){
//               let numDraws = Math.floor(Math.random() * 3);
//               for(let i = 0; i < numDraws; i++){
//                 if(dealerSum < 16){
//                   let card = getRandomIndex(deck);
//                   dealerHand.push(card);
//                   deck.delete(card[0]);
//                 } else {
//                   let randomNumber = Math.floor(Math.random() * 3);
//                   if(randomNumber === 0){
//                     let card = getRandomIndex(deck);
//                     dealerHand.push(card);
//                     deck.delete(card[0]);
//                     break;
//                   }
//                 }
//                 dealerSum = getSumOfMap(dealerHand);
//               }

//               if(dealerSum === clientSum){
//                 bust = 3;
//               } else if(clientSum < dealerSum && dealerSum < 21 || dealerSum === 21 ){
//                 bust = 1;
//               } else if (dealerSum > 21 || clientSum > dealerSum) {
//                 bust = 2;
//               }
//             }
//             if(bust === 1 || bust === 2){
//               let embedText = {
//                 clientString: createCardString(clientHand),
//                 clientSum,
//                 dealerString: createCardString(dealerHand),
//                 dealerSum,
//                 result: bust === 1 ? `You lose` : (bust === 2) ?  `You win` : `Both sides lose`,
//                 color: bust === 1 ?  15158332 : (bust === 2) ? 0x00FF00: 0x808080
//               };
//               board.edit(winnerBoard(message, embedText));
//             }
//           }
//         });
//     }
// };
