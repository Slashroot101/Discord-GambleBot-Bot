const constants = require('../../constants');
const { oneLine } = require('common-tags');

module.exports = {
  name: 'ping',
  description: 'Returns bot ping',
  costData: {
    cost: 1,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: true,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Admin',
  allowedRoles: [
    constants.roles.admin,
  ],
  async execute(client, message, args, user) {
    const pingMsg = await message.reply('Pinging...');
    return pingMsg.edit(oneLine`
			${message.channel.type !== 'dm' ? `${message.author},` : ''}
			Pong! The message round-trip took ${
    (pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)
      }ms.
			${client.ping ? `The heartbeat ping is ${Math.round(client.ping)}ms.` : ''}
		`);
  },
};
