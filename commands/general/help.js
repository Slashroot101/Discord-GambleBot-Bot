const _ = require('lodash');
const fs = require('fs');

const groups = fs.readdirSync('./commands');
const namedCommands = [];
groups.forEach((directory) => {
  const files = fs.readdirSync(`./commands/${directory}`);
  files.forEach((file) => {
    const command = require(`../${directory}/${file}`);
    namedCommands.push({ group: directory, command, path: `../${directory}/${file}` });
  });
});

const groupedCommands = _.mapValues(_.groupBy(namedCommands, 'group'), x => x.map(y => _.omit(y, 'group')));

module.exports = {
  name: 'help',
  description: 'Lists all commands and some sample usages',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  generatesMoney: false,
  usages: 1,
  execute(client, message, args) {
    if (args.length === 1) {
      let neededCommand;
      for (const property in groupedCommands) {
        const command = groupedCommands[property].filter(x => x.command.name === args[0]);
        if (command.length > 0) {
          neededCommand = command;
        }
      }

      if (neededCommand !== undefined) {
        const embed = {
          color: 0x00ff00,
          author: {
            name: message.member.user.tag,
            icon_url: message.member.user.avatarURL,
          },
          title: 'For help with a specific command, type `!help <command name>`',
          url: '',
          description: 'To see all commands, type `!help`',
          fields: [{
            name: `${neededCommand[0].command.name}`,
            value: `${neededCommand[0].command.description}`,
            inline: false,
          }],
          timestamp: new Date(),
        };

        message.author.send({ embed });
      } else {
        message.reply(' that command does not exist!');
      }
    } else {
      const fields = [];
      for (const property in groupedCommands) {
        fields.push({
          name: `**${property}**`,
          value: groupedCommands[property].map(x => x.command.name).join('\n'),
          inline: false,
        });
      }
      const embed = {
        color: 0x00ff00,
        author: {
          name: message.member.user.tag,
          icon_url: message.member.user.avatarURL,
        },
        title: 'For help with a specific command, type `!help <command name>`',
        url: '',
        description: '',
        fields,
        timestamp: new Date(),
      };

      message.author.send({ embed });
    }
  },
};
