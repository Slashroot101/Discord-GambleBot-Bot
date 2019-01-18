const hangmanImageMap = require('../../assets/hangman/fileMapToUrl');

class Hangman {
	constructor(secretPhrase) {
		if(!secretPhrase.match(/^[ A-Za-z]+$/)) { throw 'Parameter is not letters only.'; }
		this.secretPhrase = secretPhrase;
		this.inCorrectGuess = new Set();
		this.correctGuess = new Set();
		this.encodedPhrase = Hangman.encodePhrase(secretPhrase);
		this.LETTER_ALREADY_GUESSED = 0;
		this.INCORRECT_GUESS = 1;
		this.WIN = 2;
		this.CORRECT_LETTER = 3;
		this.LOSE = 4;
		this.IN_PROGRESS = 5;
		this.gameState = this.IN_PROGRESS;
	}

	getCurrentSentenceWithGuesses() {
		return this.encodedPhrase;
	}

	setGameOver(){
		this.gameState = this.LOSE;
	}

	toGameboardEmbed(message) {
		
		let color;
		if(this.gameState === this.WIN) {
			color = 0x00ff00;
		}
		else if(this.gameState === this.LOSE) {
			color =	15158332;
		}
		else {
			color = 3447003;
		}

		return {
			color,
			author: {
				name: message.member.user.tag,
				icon_url: message.member.user.avatarURL,
			},
			title: `${ this.gameState === this.WIN || this.gameState === this.LOSE ? `Secret Phrase: ${this.secretPhrase}` : ''}`,
			url: '',
			description: `**Incorrect:** ${[...this.inCorrectGuess].join(', ')} \n **Correct:** ${[...this.correctGuess].join(', ')} `,
			footer: {
				text: `Incorrect Guesses: ${this.inCorrectGuess.size} | Correct Guesses: ${this.correctGuess.size}`,
			},
			image: {
				url: hangmanImageMap[`${this.inCorrectGuess.size}`],
			},
			fields: [
				{
					name: 'Hangman has begun! Type `!guess <letter or phrase>` to begin',
					value: `${this.getCurrentSentenceWithGuesses()}`,
					inline: true,
				},

			],
			timestamp: new Date(),
		};
	}

	decodeWithGuess(guess) {
		if(guess === this.secretPhrase) {
			this.encodedPhrase = '';
			for(let i = 0; i < this.secretPhrase.length; i++) {
				this.encodedPhrase += `${this.secretPhrase.substr(i, 1)}|`;
			}
			return;
		}
		const locations = new Set();
		for(let i = 0; i < this.secretPhrase.length - guess.length + 1; i++) {
			if(this.secretPhrase.substr(i, guess.length) === guess
			|| this.secretPhrase.substr(i, guess.length) === guess.toLowerCase()
			|| this.correctGuess.has(this.secretPhrase.substr(i, guess.length))) {
				locations.add(i);
			}
		}

		if(!locations.size === 0) {
			return this.encodedPhrase;
		}

		this.encodedPhrase = '';
		for(let i = 0; i < this.secretPhrase.length; i++) {
			if(locations.has(i)) {
				this.encodedPhrase += `${this.secretPhrase.substr(i, 1)}|`;
			}
			else if(this.secretPhrase.charAt(i) === ' ') {
				this.encodedPhrase += ' ';
			}
			else {
				this.encodedPhrase += '\\_|';
			}
		}
		return this.encodedPhrase;
	}

	guess(userGuess) {
		if(this.inCorrectGuess.size === 7) {
			this.gameState = this.LOSE;
			return this.LOSE;
		}

		if(userGuess !== ''
		 && (userGuess === this.secretPhrase
		 || !this.encodedPhrase.includes('_'))) {
			this.decodeWithGuess(userGuess);
			this.gameState = this.WIN;
			return this.WIN;
		}

		if(userGuess.length === 0
		 || userGuess.length > 1
		 || !this.secretPhrase.includes(userGuess)) {
			this.inCorrectGuess.add(userGuess);
			return this.INCORRECT_GUESS;
		}

		if(this.inCorrectGuess.has(userGuess)
		 || this.correctGuess.has(userGuess)) {
			return this.LETTER_ALREADY_GUESSED;
		}

		this.correctGuess.add(userGuess);

		if(this.secretPhrase.includes(userGuess)) {
			this.decodeWithGuess(userGuess);
			const encodedPhrase = this.getCurrentSentenceWithGuesses();
			if(!encodedPhrase.includes('_')) {
				this.gameState = this.WIN;
				return this.WIN;
			}
			return this.CORRECT_LETTER;
		}

		return this.INCORRECT_GUESS;
	}

	static encodePhrase(secretPhase) {
		return secretPhase.replace(/[A-Za-z]/g, '\\_|');
	}
}

module.exports = Hangman;