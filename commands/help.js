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
  execute(client, message) {
    let adminCommands = '';
    let normieCommands = '';
    let adminCount = 1;
    let normieCount = 1;
    for (let i = 0; i < commandFiles.length; i += 1) {
      const commandFile = require(`./${commandFiles[i]}`);
      if (commandFile.requiresAdmin) {
        adminCommands += `${adminCount}. ${commandFile.name} : ${commandFile.description} \n`;
        adminCount += 1;
      } else {
        normieCommands += `${normieCount}. ${commandFile.name} : ${commandFile.description} \n`;
        normieCount += 1;
      }
    }

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

    message.author.send({ embed });
  },
};
