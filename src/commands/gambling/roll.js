const Points = require('../../api/points');

module.exports = {
  name: 'roll',
  description: 'Take your chances at rolling three dice. Get all three right, and triple your bet. `!roll <bet> <face> <face> <face>` Ex: `!roll 300 3 5 2`',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  generatesMoney: true,
  usages: 1,
  async execute(client, message, args, user) {
    const bet = Number(parseInt(args[0], 10));
    const face1 = Number(parseInt(args[1], 10));
    const face2 = Number(parseInt(args[2], 10));
    const face3 = Number(parseInt(args[3], 10));
    if (Number.isNaN(face1)
      || Number.isNaN(face2)
      || Number.isNaN(face3)
      || face1 === ''
      || face2 === ''
      || face3 === '') {
      return message.reply(' all of the faces you entered must be numbers. Such as `!roll 200 3 3 3` where 3 are faces on the die.');
    }

    if (bet < 0) {
      return message.reply(' your bet must be more than 0.');
    }

    if (Number.isNaN(bet || bet > Number.MAX_SAFE_INTEGER)) {
      return message.reply(`your bet must be a number and be less than ${Number.MAX_SAFE_INTEGER}.`);
    }

    if (user.current_balance < bet) {
      return message.reply(`you do not have enough money! You currently have ${user.current_balance}, and would need to gain $${bet - user.current_balance} more to make that bet.`);
    }

    const diceRoll1 = Math.floor((Math.random() * 6) + 1);
    const diceRoll2 = Math.floor((Math.random() * 6) + 1);
    const diceRoll3 = Math.floor((Math.random() * 6) + 1);

    if (face1 === diceRoll1 && face2 === diceRoll2 && face3 === diceRoll3) {
      await Points.addPointsByUserID(user.user_id, message.guild.id, bet * 3);
      const embed = {
        color: 0x00ff00,
        author: {
          name: message.member.user.tag,
          icon_url: message.member.user.avatarURL,
        },
        title: '',
        url: '',
        description: '',
        fields: [
          {
            name: `**Congrats, you won $${bet * 3} **`,
            value: `Dice 1: ${diceRoll1} \n Dice 2: ${diceRoll2} \n Dice 3: ${diceRoll3}`,
            inline: false,
          },
        ],
        timestamp: new Date(),
      };

      message.channel.send({ embed });
      return bet * 3;
    }
    await Points.addPointsByUserID(user.user_id, message.guild.id, bet * -1);
    const embed = {
      color: 15158332,
      author: {
        name: message.member.user.tag,
        icon_url: message.member.user.avatarURL,
      },
      title: '',
      url: '',
      description: '',
      fields: [
        {
          name: `**Whoops, you just lost $${bet}. **`,
          value: `Dice 1: ${diceRoll1} \n Dice 2: ${diceRoll2} \n Dice 3: ${diceRoll3}`,
          inline: false,
        },
      ],
      timestamp: new Date(),
    };

    message.channel.send({ embed });
    return bet * -1;
  },
};
