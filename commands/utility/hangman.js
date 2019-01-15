let hangmanImageMap = require('../../assets/hangman/fileMapToUrl');

class Hangman {
	constructor(secretPhrase) {
		if(!secretPhrase.match(/^[ A-Za-z]+$/)) { throw 'Parameter is not letters only.'; }
		this.secretPhrase = secretPhrase;
		this.guessedLetters = new Set();
		this.encodedPhrase = Hangman.encodePhrase(secretPhrase);
		this.WIN = 2;
		this.INCORRECT_GUESS = 1;
		this.LETTER_ALREADY_GUESSED = 0;
		this.CORRECT_LETTER = 3;
	}

	getCurrentSentenceWithGuesses() {
		return this.encodedPhrase;
	}

	toGameboardEmbed(message) {
		const embed = {
			color: 3447003,
			author: {
				name: message.member.user.tag,
				icon_url: message.member.user.avatarURL,
			},
			title: '',
			url: '',
			description: '',
			image: {
				url: hangmanImageMap[`${this.guessedLetters.size}`],
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

		return embed;
	}

	decodeWithGuess(guess) {
		const locations = new Set();
		for(let i = 0; i < this.secretPhrase.length - guess.length + 1; i++) {
			if(this.secretPhrase.substr(i, guess.length) === guess
			|| this.guessedLetters.has(this.secretPhrase.substr(i, guess.length))) {
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
		if(userGuess === this.secretPhrase) {
			return this.WIN;
		}

		if(userGuess.length > 1) {
			return this.INCORRECT_GUESS;
		}

		if(this.guessedLetters.has(userGuess)) {
			return this.LETTER_ALREADY_GUESSED;
		}

		guessedLetters.add(userGuess);

		if(this.secretPhrase.includes(userGuess)) {
			this.decodeWithGuess(userGuess);
			const encodedPhrase = this.getCurrentSentenceWithGuesses();
			if(!encodedPhrase.includes('_')) {
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