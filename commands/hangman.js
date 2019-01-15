const Discord = require('discord.js');
const { prefix } = require('../config');
const Hangman = require('./utility/hangman');

module.exports = {
	name: 'hangman',
	description: 'Play hangman. Try `!hangman <bet>`. Win 3x your bet if no one guesses the word',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	async execute(client, message, args, user) {
		const bet = Number(parseInt(args[0]));

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

		console.log(privateMessage.channel.id);

		const dmCollector = new Discord.MessageCollector(privateMessage.channel, m => m.author.id === message.author.id, { time: 30000 });
		let hangmanBoard;
		dmCollector.on('collect', msg => {
			const command = msg.content.slice(prefix.length).split(/ +/).shift().toLowerCase();

			if(command === 'sentence') {
				const sentence = msg.content.substr(prefix.length + 9, msg.content.length).replace(/\s+/g, ' ');
				if(!sentence.match(/^[ A-Za-z]+$/)) {
					return message.author.send('Your sentence may only contain letters.');
				}

				hangmanBoard = new Hangman(sentence);
				dmCollector.stop();
			}
		});

		dmCollector.on('end', async () => {
			const boardMessage = await message.channel.send({ embed: hangmanBoard.toGameboardEmbed(message) });
			const guessCollector = new Discord.MessageCollector(message.channel, (m) => m.author.id !== message.author.id, { time: 30000 });

			guessCollector.on('collect', msg => {
				const command = msg.content.slice(prefix.length).split(/ +/).shift().toLowerCase();
				if(command === 'guess'){
					console.log(command, msg)
				}
			});
		});

	},
};