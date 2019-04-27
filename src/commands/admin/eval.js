const constants = require('../../constants');
const tags = require('common-tags');
const util = require('util');
const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');
const discord = require('discord.js');

module.exports = {
  name: 'eval',
  description: 'Evaluate a javascript string, only for the coolest of users. Ex: `{0}eval process.exit(0)`',
  costData: {
    cost: 1,
    hasCost: false,
  },
  cooldown: {
    hasCooldown: false,
    executions: 1,
    cooldownInMinutes: 2
  },
  group: 'Admin',
  allowedRoles: [
    constants.roles.admin,
  ],
  async execute(client, message, args, user) {
    const doReply = val => {
      if(val instanceof Error) {
        message.reply(`Callback error: \`${val}\``);
      } else {
        const result = makeResultMessages(val, process.hrtime(this.hrStart));
        if(Array.isArray(result)) {
          for(const item of result) msg.reply(item);
        } else {
          message.reply(result);
        }
      }
    };
    /* eslint-enable no-unused-vars */

    // Run the code and measure its execution time
    let hrDiff;
    try {
      const hrStart = process.hrtime();
      this.lastResult = eval(args.join(' '));
      hrDiff = process.hrtime(hrStart);
    } catch(err) {
      return message.reply(`Error while evaluating: \`${err}\``);
    }

    // Prepare for callback time and respond
    this.hrStart = process.hrtime();
    const result = makeResultMessages(this.lastResult, hrDiff, args.script);
    if(Array.isArray(result)) {
      return result.map(item => message.reply(item));
    } else {
      return message.reply(result);
    }
  },
};

function makeResultMessages(result, hrDiff, input = null) {
  const inspected = util.inspect(result, { depth: 0 })
    .replace(nlPattern, '\n')
    .replace(this.sensitivePattern, '--snip--');
  const split = inspected.split('\n');
  const last = inspected.length - 1;
  const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
  const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
    split[split.length - 1] :
    inspected[last];
  const prepend = `\`\`\`javascript\n${prependPart}\n`;
  const append = `\n${appendPart}\n\`\`\``;
  if(input) {
    return discord.splitMessage(tags.stripIndents`
				*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
  } else {
    return discord.splitMessage(tags.stripIndents`
				*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
  }
}

