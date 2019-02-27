const Discord = require('discord.js');
const { prefix } = require('../config');
const Hangman = require('./utility/hangman');

const currentChannelsInGame = new Set();


module.exports = {
  name: 'hangman',
  description: 'Play hangman. Try `!hangman`.',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  generatesMoney: false,
  usages: 1,
  async execute(client, message) {
    if (currentChannelsInGame.has(message.channel.id)) {
      message.reply('there is a game currently going on in this channel. Please choose another channel or wait until the game is done.');
      return;
    }

    const privateMessage = await message.author.send('To start hangman I need a sentence/word from you, type `!sentence <word/sentence>` such as `!sentence wow this bot is awesome`. Please keep in mind that only letters are allowed in hangman. You have 30 seconds.');
    const dmCollector = new Discord.MessageCollector(
      privateMessage.channel,
      m => m.author.id === message.author.id, { time: 30000 },
    );
    let hangmanBoard;
    dmCollector.on('collect', (msg) => {
      const command = msg.content.slice(prefix.length).split(/ +/).shift().toLowerCase();

      if (command === 'sentence') {
        const sentence = msg.content.substr(prefix.length + 9, msg.content.length).replace(/\s+/g, ' ');
        if (!sentence.match(/^[ A-Za-z]+$/)) {
          message.author.send('Your sentence may only contain letters.');
          return;
        }
        currentChannelsInGame.add(message.channel.id);
        hangmanBoard = new Hangman(sentence);
        dmCollector.stop();
      }
    });

    dmCollector.on('end', async () => {
      let boardMessage = await message.channel.send(
        {
          embed: hangmanBoard.toGameboardEmbed(message),
        },
      );
      const guessCollector = new Discord.MessageCollector(
        message.channel,
        m => m.author.id !== message.author.id, { time: 120000 },
      );
      const gameTimeout = setTimeout(async () => {
        hangmanBoard.setGameOver();
        await message.channel.send('The game has timed out.');
        await message.channel.send({ embed: hangmanBoard.getLeaderboard(message) });
        await message.channel.send({ embed: hangmanBoard.toGameboardEmbed(message) });
        currentChannelsInGame.delete(message.channel.id);
      }, 60000);
      let numGuesses = 0;
      guessCollector.on('collect', async (msg) => {
        const command = msg.content.slice(prefix.length).split(/ +/).shift().toLowerCase();

        if (command === 'guess') {
          const guess = msg.content.slice(prefix.length + command.length + 1).replace(/\s+/g, ' ');
          if (!guess.match(/^[ A-Za-z]+$/)) { return message.reply('your guess must be a letter'); }
          const isCorrectGuess = hangmanBoard.guess(guess, msg.author.id);
          if (isCorrectGuess === hangmanBoard.INCORRECT_GUESS) {
            await msg.reply(`'${guess}' is not a part of the sentence.`);
          } else if (isCorrectGuess === hangmanBoard.LETTER_ALREADY_GUESSED) {
            await msg.reply(`'${guess} has already been guessed.'`);
          } else if (isCorrectGuess === hangmanBoard.CORRECT_LETTER) {
            await msg.reply(`correct guess! '${guess}' is a part of the sentence.`);
          } else if (isCorrectGuess === hangmanBoard.LOSE) {
            await msg.channel.send('The game has ended! The secret phrase was not solved.');
          } else {
            await message.channel.send('The game has ended. The secret phrase was solved');
            await message.channel.send({ embed: hangmanBoard.getLeaderboard(msg) });
            currentChannelsInGame.delete(msg.channel.id);
            guessCollector.stop();
            clearTimeout(gameTimeout);
            numGuesses = 3;
          }
          if (numGuesses % 3 === 0) {
            boardMessage = await msg.channel.send(
              { embed: hangmanBoard.toGameboardEmbed(message) },
            );
          } else {
            await boardMessage.edit({ embed: hangmanBoard.toGameboardEmbed(message) });
          }
          numGuesses += 1;
        }
      });
    });
  },
};
