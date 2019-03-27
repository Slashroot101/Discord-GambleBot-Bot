const { toggleMaintenanceMode } = require('../../api/commands');
const REGEX_CONST = require('../../utility/constants/regex');

module.exports = {
  name: 'toggleMaintenance',
  description: 'Toggles commands on/off maintenance',
  requiresAdmin: true,
  duration: 60,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  async execute(client, message, args) {
    if (args.length === 0) {
      message.reply(' you must provide a command ID or name to toggle maintenance mode on/off.');
      return;
    }

    if (args[1] !== 'on' && args[1] !== 'off') {
      message.reply(' you must provide a value to toggle to, such as on or off.');
      return;
    }

    const isInMaintenance = args[1] === 'on';
    const isNumber = !Number.isNaN(Number.parseInt(args[0], 10));
    if (isNumber || new RegExp(REGEX_CONST.lettersOnlyRegex).test(args[0])) {
      const command = client.commands
        .filter(x => x.name === args[0] || x.id === Number.parseInt(args[0], 10));
      const commandObject = command.values().next().value;
      if (!commandObject) {
        message.reply(` ${args[0]} is not a command.`);
        return;
      }

      commandObject.maintenanceMode = isInMaintenance;
      client.commands.set(commandObject.name, commandObject);
      await toggleMaintenanceMode(commandObject.id, isInMaintenance);
      await message.reply(` successfully toggled maintenance mode for ${args[0]} to ${args[1]}`);
      await client.shard.broadcastEval(`client.commands.set(${commandObject.name}, ${commandObject})`);
    } else {
      message.reply(' you must supply your command as the command name or the command ID.');
    }
  },
};
