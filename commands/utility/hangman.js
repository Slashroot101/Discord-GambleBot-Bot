class Hangman {
	constructor(secretPhrase) {
		if(!secretPhrase.match(/^[ A-Za-z]+$/)) { throw 'Parameter is not letters only.'; }
		this.secretePhrase = secretPhrase;
		this.guessedLetters = [];
		this.encodedPhrase = Hangman.encodePhrase(secretPhrase);
	}

	static encodePhrase(secretPhase) {
		return secretPhase.replace(/[A-Za-z]/g, '-/');
	}
}

module.exports = Hangman;