const Discord = require('discord.js');

module.exports = {
	name: 'hangman',
	description: 'Play hangman. Try `!hangman <bet>`. Win 3x your bet if no one guesses the word',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	execute(client, message, args, user) {
        const bet = Number(parseInt(args[0]));

		if(bet < 0){
			return message.reply('your bet must be greater than or equal to 0.')
		}

		if(isNaN(bet)){
			return message.reply('your bet must be a number.');
		}

		if (user.current_balance < bet) {
			return message.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to gain $${bet - user.current_balance} more to make that bet.`);
        }

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        
    	collector.on('collect', msg => {
            console.log(msg)
        });
	},
};