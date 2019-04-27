const constants = require('../../constants');
const Guild = require('../../api/guild');

module.exports = {
  name: 'prefix',
  description: 'Changes the prefix for your guild. You must have administrator powers in the guild. Ex: `{0}prefix !`',
  costData: {
    cost: 0,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: true,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Utility',
  allowedRoles: [
  ],
  async execute(client, message, args, user) {
    const isAdmin = message.channel.permissionsFor(message.member).has("ADMINISTRATOR", false);
    if(!isAdmin){
      return message.reply(' you do not have proper permission to execute this command. You need server level admin permission.');
    }

    if(!args.length) {
      return message.reply(' you must supply a prefix for me to change to');
    }

    const guild = await Guild.getGuildWithFilter({discordGuildID: [message.guild.id]});
    await Guild.updateGuild(guild[0]._id, {prefix: args.join(' ')});
    client.prefix.set(message.guild.id, args.join(' '));
    console.log(client.prefix.get(message.guild.id))
    return message.reply(` your guild prefix has been changed to ${args.join(' ')}`);
  },
};
