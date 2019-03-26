module.exports = {
  name: 'coinflip',
  description: 'Settle a bet with a coin flip. Ex. `!coinflip`',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  generatesMoney: false,
  usages: 1,
  async execute(client, message) {
    const flip = Math.floor(Math.random() * Math.floor(2));
    const side = flip === 1 ? 'heads' : 'tails';
    message.reply(` the coin landed on ${side}`);
  },
};
