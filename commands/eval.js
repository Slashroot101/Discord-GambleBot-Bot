const { cleanForEval } = require('../commands/utility/cleanForEval');
const util = require('util');

module.exports = {
  name: 'eval',
  description: 'You have to be really cool to execute this command 😎',
  requiresAdmin: true,
  duration: 60,
  hasCooldown: false,
  usages: 1,
  generatesMoney: false,
  async execute(client, message, args) {
  	try {
		  const code = args.join(' ');
		  let evaled = eval(code);

		  if (typeof evaled !== 'string') evaled = util.inspect(evaled);
		  message.channel.send(cleanForEval(evaled), { code: 'xl' });
	  } catch (err) {
		  message.channel.send(`\`ERROR\` \`\`\`xl\n${cleanForEval(err)}\n\`\`\``);
	  }
  },
};
