const { create } = require('../api/channels');

module.exports = {
  name: 'here',
  description: 'Set the guild\'s communication channel to the one you type `!here` in. Only users with permission to create/edit channels can use this.',
  hasCooldown: false,
  duration: 1,
  requiresAdmin: false,
  generatesMoney: false,
  usages: 1,
  execute: async (client, message, args, user) => new Promise(async (resolve) => {
  	const permissions = message.channel.permissionsFor(message.member);
    if (permissions.has('MANAGE_CHANNELS', true)) {
    	await create(message.channel.id, user.user_id, message.guild.id);
    	message.reply(` ${message.channel.name} was succesfully set as the bot's communication channel`);
    } else {
    	message.reply(' you must have edit privileges on this channel or admin permissions to execute this command.');
    }
    resolve();
  }),
};
