const Discord = require('discord.js');
const { prefix } = require('../config');
const Hangman = require('./utility/hangman');
const currentChannelsInGame = new Set();


module.exports = {
	name: 'hangman',
	description: 'Play hangman. Try `!hangman <bet>`. Win 3x your bet if no one guesses the word',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	async execute(client, message, args, user) {
		const bet = Number(parseInt(args[0]));

		if(currentChannelsInGame.has(message.channel.id)){
			return message.reply('there is a game currently going on in this channel. Please choose another channel or wait until the game is done.');
		}

		if(bet < 0) {
			return message.reply('your bet must be greater than or equal to 0.');
		}

		if(isNaN(bet)) {
			return message.reply('your bet must be a number.');
		}

		if (user.current_balance < bet) {
			return message.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to gain $${bet - user.current_balance} more to make that bet.`);
		}

		const privateMessage = await message.author.send('To start hangman I need a sentence/word from you, type `!sentence <word/sentence>` such as `!sentence wow this bot is awesome`. Please keep in mind that only letters are allowed in hangman. You have 30 seconds.');

		const dmCollector = new Discord.MessageCollector(privateMessage.channel, m => m.author.id === message.author.id, { time: 30000 });
		let hangmanBoard;
		dmCollector.on('collect', msg => {
			const command = msg.content.slice(prefix.length).split(/ +/).shift().toLowerCase();

			if(command === 'sentence') {
				const sentence = msg.content.substr(prefix.length + 9, msg.content.length).replace(/\s+/g, ' ');
				if(!sentence.match(/^[ A-Za-z]+$/)) {
					return message.author.send('Your sentence may only contain letters.');
				}
				currentChannelsInGame.add(message.channel.id);
				hangmanBoard = new Hangman(sentence);
				dmCollector.stop();
			}
		});

		dmCollector.on('end', async () => {
			const boardMessage = await message.channel.send({ embed: hangmanBoard.toGameboardEmbed(message) });
			const guessCollector = new Discord.MessageCollector(message.channel, (m) => m.author.id !== message.author.id, { time: 60000 });
			
			guessCollector.on('collect', async msg => {
				const args = msg.content.slice(prefix.length).split(/ +/);
				const command = args.shift().toLowerCase();
				if(command === 'guess'){
					const guess = msg.content.slice(prefix.length + command.length + 1).replace(/\s+/g, ' ');
					if(!guess.match(/^[ A-Za-z]+$/)){ return message.reply('your guess must be a number');}
					const isCorrectGuess = hangmanBoard.guess(guess);
					if(isCorrectGuess === hangmanBoard.INCORRECT_GUESS){
						await message.reply(`'${guess}' is not a part of the sentence.`);
					} else if (isCorrectGuess === hangmanBoard.LETTER_ALREADY_GUESSED){
						await message.reply(`'${guess} has already been guessed.'`);
					} else if (isCorrectGuess === hangmanBoard.CORRECT_LETTER){
						await message.reply(`correct guess! '${guess}' is a part of the sentence.`);
					} else if(isCorrectGuess === hangmanBoard.LOSE){
						await message.channel.send(`The game has ended! The secret phrase was not solved.`);
					} else {
						await message.channel.send('The game has ended. The secret phrase was solved');
						currentChannelsInGame.delete(message.channel.id);
						guessCollector.stop();
					}
					await boardMessage.edit({embed: hangmanBoard.toGameboardEmbed(message)});
				}
			});
		});

	},
};