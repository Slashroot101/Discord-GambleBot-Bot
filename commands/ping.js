module.exports = {
  name: 'ping',
  description: 'Ping! See if the bot is alive. Ex: `!ping`',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  execute(client, message) {
    message.channel.send('Pong.');
  },
};
