const Command = require('../api/command');
const fs = require('fs');

module.exports = async (client) => {
  const commandDirectories = fs.readdirSync(`${process.cwd()}/src/commands`);
  const allCommands = await Command.getWithFilter();
  const commands = new Map();
  for (const directory of commandDirectories) {
    const files = fs.readdirSync(`${process.cwd()}/src/commands/${directory}`);
    files.forEach(async (file) => {
      const command = require(`${process.cwd()}/src/commands/${directory}/${file}`);
      let foundCommand = allCommands.filter(x => x.name === command.name);
      if(!foundCommand.length){
        command.isInMaintenanceMode = false;
        foundCommand = [await Command.createCommand(command)];
      }
      command._id = foundCommand[0]._id;
      command.isInMaintenanceMode = foundCommand[0].isInMaintenanceMode;
      commands.set(command.name, command);
    });
  }

  return commands;
};
