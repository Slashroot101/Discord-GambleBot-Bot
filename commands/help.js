const fs = require('fs');

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'))
  .map(x => require(`./${x}`));
module.exports = {
  name: 'help',
  description: 'Lists all commands and some sample usages',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  generatesMoney: false,
  usages: 1,
  execute(client, message, args) {
    let adminCommands = '';
    let normieCommands = '';
    let adminCount = 1;
    let normieCount = 1;
    let embed;
    if (args.length === 1) {
      const neededCommand = commandFiles.filter(x => x.name === args[0]);
      if (neededCommand.length === 1 && neededCommand[0].name === undefined) {
        message.reply(' that is not a valid command. Please check the spelling of your command');
        return undefined;
      }
      embed = {
        color: 0x00ff00,
        author: {
          name: message.member.user.tag,
          icon_url: message.member.user.avatarURL,
        },
        title: 'For help with a specific command, type `!help <command name>`',
        url: '',
        description: '',
        fields: [
          {
            name: `${neededCommand[0].name}`,
            value: `${neededCommand[0].description}`,
            inline: false,
          },
        ],
        timestamp: new Date(),
      };
    } else {
      for (let i = 0; i < commandFiles.length; i += 1) {
        if (commandFiles[i].requiresAdmin) {
          adminCommands += `${adminCount}. ${commandFiles[i].name} \n`;
          adminCount += 1;
        } else {
          normieCommands += `${normieCount}. ${commandFiles[i].name} \n`;
          normieCount += 1;
        }
      }
      embed = {
        color: 0x00ff00,
        author: {
          name: message.member.user.tag,
          icon_url: message.member.user.avatarURL,
        },
        title: 'For help with a specific command, type `!help <command name>`',
        url: '',
        description: '',
        fields: [
          {
            name: '**Basic User Commands**',
            value: `${normieCommands}`,
            inline: false,
          },
          {
            name: '**Admin Commands**',
            value: `${adminCommands}`,
            inline: false,
          },
        ],
        timestamp: new Date(),
      };
    }

    message.author.send({ embed });
    return undefined;
  },
};
