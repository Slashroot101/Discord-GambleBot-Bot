const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')).map(x => require(`./${x}`));
const Points = require('../api/points');

module.exports = {
  name: 'net',
  description: 'See how much you have netted off of each command. `Ex: !net bj`',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  async execute(client, message, args, user) {
    if (args.length === 0) {
      message.reply('You must supply a command to check your net values on. Such as `!net bj`');
      return;
    }

    const command = commandFiles.filter(file => {
      return file.name === args[0];
    });
    console.log(command)

    if (!command.length > 0) {
      message.reply('that command does not exist.');
      return;
    }
    if (command[0].generatesMoney) {
      const netPoints = await Points.getNetCommandPoints(command[0].id, user.user_id);
      message.reply(`you have netted $${Object.entries(netPoints).length ? netPoints.netPoints.total_points_gained : 0} off of ${command[0].name}.`);
    } else if (!command[0].generatesMoney) {
      message.reply(`you have netted $0 off of ${command[0].name}. This command does not generate money.`);
    }
  },
};
