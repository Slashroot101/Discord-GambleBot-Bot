const constants = require('../../constants');

module.exports = {
    name: 'net',
    description: 'Tells you how much you have earned from a command Ex: `{0}net bj`',
    costData: {
      cost: 1,
      hasCost: false,
    },
    cooldown: {
      hasCooldown: false,
      executions: 1,
      cooldownInMinutes: 2
    },
    group: 'Points',
    allowedRoles: [
      constants.roles.baseUser, constants.roles.admin,
    ],
    async execute(client, message, args, user) {
      if(args.length === 0){
        return message.reply(' you must provide what command you want your net points for.');
      }

      console.log(client.commands);

      const command = client.commands.get(args[0]);

	  if(!command){
		  return message.reply(' that command does not exist!');
	  }

	  const userCommandAudit = user.commandExecutionMetaData.filter(x => x.commandID === command._id);

	  if(!userCommandAudit){
		  return message.reply(' you have not executed that command yet or it does not generate points!');
	  }

      return message.channel.send({embed: {
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
            name: `**Net Points For ${args[0]}**`,
            value: `${userCommandAudit[0].netPoints}`,
            inline: true,
          },
        ],
        timestamp: new Date(),
      }});
    },
  };
  