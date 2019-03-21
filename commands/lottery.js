module.exports = {
  name: 'lottery',
  description: 'Creates a lottery in the guild. You MUST have enough for 5 tickets to begin. Try `!lottery <ticketCost>` to begin!',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: true,
  usages: 1,
  generatesMoney: false,
  execute(client, message) {
    message.channel.send('Pong.');
  },
};
