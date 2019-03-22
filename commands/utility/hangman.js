const _ = require('lodash');
const hangmanImageMap = require('../../assets/hangman/fileMapToUrl');
const {lettersOnlyRegex} = require('./constants/regex');

class Hangman {
  constructor(secretPhrase) {
    if (!secretPhrase.match(lettersOnlyRegex)) { throw new Error('Parameter is not letters only.'); }
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
    this.playerPoints = new Map();
  }

  getCurrentSentenceWithGuesses() {
    return this.encodedPhrase;
  }

  setGameOver() {
    this.gameState = this.LOSE;
  }

  getLeaderboard(message) {
    const leaderboard = Array.from(this.playerPoints);
    const sortedLeaderboard = _.sortBy(leaderboard, n => n[1].numAnswered);
    let embedString = '';
    const secretPhraseLength = this.secretPhrase.replace(/\s/g, '').length;
    for (let i = 0; i < sortedLeaderboard.length; i += 1) {
      embedString += `${i + 1}. <@${sortedLeaderboard[i][0]}> : ${sortedLeaderboard[i][1].numAnswered}/${secretPhraseLength} (${(sortedLeaderboard[i][1].numAnswered / secretPhraseLength).toFixed(2) * 100}%)\n`;
    }

    return {
      color: 0x00ff00,
      title: 'Leaderboard',
      url: '',
      author: {
        name: message.member.user.tag,
        icon_url: message.member.user.avatarURL,
      },
      description: 'Hangman Rankings',
      fields: [
        {
          name: '\u200b',
          value: sortedLeaderboard.length > 0 ? embedString : 'No one guessed correctly',
          inline: true,
        },
      ],
      footer: { text: 'Hangman Leaderboard' },
      timestamp: new Date(),
    };
  }

  toGameboardEmbed(message) {
    let color;
    if (this.gameState === this.WIN) {
      color = 0x00ff00;
    } else if (this.gameState === this.LOSE) {
      color = 15158332;
    } else {
      color = 3447003;
    }

    return {
      color,
      author: {
        name: message.member.user.tag,
        icon_url: message.member.user.avatarURL,
      },
      title: `${this.gameState === this.WIN || this.gameState === this.LOSE ? `Secret Phrase: ${this.secretPhrase}` : ''}`,
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
    if (guess === this.secretPhrase) {
      this.encodedPhrase = '';
      for (let i = 0; i < this.secretPhrase.length; i += 1) {
        this.encodedPhrase += `${this.secretPhrase.substr(i, 1)}|`;
      }
      return undefined;
    }
    const locations = new Set();
    for (let i = 0; i < this.secretPhrase.length - guess.length + 1; i += 1) {
      if (this.secretPhrase.substr(i, guess.length) === guess
          || this.secretPhrase.substr(i, guess.length) === guess.toLowerCase()
          || this.correctGuess.has(this.secretPhrase.substr(i, guess.length))) {
        locations.add(i);
      }
    }

    if (!locations.size === 0) {
      return this.encodedPhrase;
    }

    this.encodedPhrase = '';
    for (let i = 0; i < this.secretPhrase.length; i += 1) {
      if (locations.has(i)) {
        this.encodedPhrase += `${this.secretPhrase.substr(i, 1)}|`;
      } else if (this.secretPhrase.charAt(i) === ' ') {
        this.encodedPhrase += ' ';
      } else {
        this.encodedPhrase += '\\_|';
      }
    }
    return this.encodedPhrase;
  }

  guess(userGuess, discordID) {
    if (this.inCorrectGuess.size === 6) {
      this.gameState = this.LOSE;
      return this.LOSE;
    }

    if (userGuess !== ''
      && (userGuess === this.secretPhrase
        || !this.encodedPhrase.includes('_'))) {
      const player = this.playerPoints.get(discordID);
      if (!player) {
        this.playerPoints.set(discordID, { numAnswered: this.secretPhrase.replace(/\s/g, '').length });
      }
      this.decodeWithGuess(userGuess);
      this.gameState = this.WIN;
      return this.WIN;
    }

    if (userGuess.length === 0
      || userGuess.length > 1
      || !this.secretPhrase.includes(userGuess)) {
      this.inCorrectGuess.add(userGuess);
      if (this.inCorrectGuess.size === 6) {
        this.gameState = this.LOSE;
        return this.LOSE;
      }
      return this.INCORRECT_GUESS;
    }

    if (this.inCorrectGuess.has(userGuess)
      || this.correctGuess.has(userGuess)) {
      return this.LETTER_ALREADY_GUESSED;
    }

    if (this.secretPhrase.includes(userGuess)) {
      this.decodeWithGuess(userGuess);
      const encodedPhrase = this.getCurrentSentenceWithGuesses();
      this.correctGuess.add(userGuess);
      this.correctGuess.add(userGuess.toLowerCase());
      const player = this.playerPoints.get(discordID);
      if (!player) {
        this.playerPoints.set(discordID, { numAnswered: this.secretPhrase.match(new RegExp(userGuess, 'gi')).length });
      } else {
        this.playerPoints.set(discordID, { numAnswered: player.numAnswered + this.secretPhrase.match(new RegExp(userGuess, 'gi')).length });
      }
      if (!encodedPhrase.includes('_')) {
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
