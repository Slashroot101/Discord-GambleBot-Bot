module.exports = {
  name: 'coinflip',
  description: 'Flips a coin Ex: `{0}coinflip`',
  costData: {
    cost: 1,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: true,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Games',
  allowedRoles: [
  ],
  async execute(client, message) {
    const flip = Math.floor(Math.random() * Math.floor(2));
    const side = flip === 1 ? 'heads' : 'tails';
    message.reply(` the coin landed on ${side}`);
  },
};
