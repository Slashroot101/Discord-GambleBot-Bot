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

      const command = client.commands.get();

      // return message.channel.send({embed: {
      //   color: 0x00ff00,
      //   author: {
      //     name: message.member.user.tag,
      //     icon_url: message.member.user.avatarURL,
      //   },
      //   title: '',
      //   url: '',
      //   description: '',
      //   fields: [
      //     {
      //       name: `**Net Points For**`,
      //       value: `${user.points.currentPoints}`,
      //       inline: true,
      //     },
      //   ],
      //   timestamp: new Date(),
      // }});
    },
  };
  