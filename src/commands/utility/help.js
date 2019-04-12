const _ = require('lodash');
const constants = require('../../constants');

module.exports = {
	name: 'help',
	description: 'Lists all commands or descriptions',
	costData: {
		cost: 0,
		hasCost: false,
	},
	cooldown: {
		hasCooldown: false,
		executions: 1,
		cooldownInMinutes: 2
	},
	group: 'Utility',
	allowedRoles: [
	],
	async execute(client, message, args, user) {
		const guildPrefix = client.prefix.get(message.guild.id);
		if(!args[0]){
			const fields = [];
			const arrayCommands = Array.from(client.commands).map(x => x[1]);
			const groupedCommands = _.mapValues(_.groupBy(arrayCommands, 'group'),
				commandList => commandList.map(command => _.omit(command, 'group')));
			for(let key in groupedCommands){
				const command = groupedCommands[key];
				let embedString = '';

				for(let i = 0; i < command.length; i++){
					embedString += `${command[i].allowedRoles.includes(user.role) || command[i].allowedRoles.length === 0 ? ':white_check_mark:' : ':x:'} ${command[i].name}\n`
				}
				fields.push({
					name: `**${key}**`,
					value: embedString,
					inline: true,
				})
			}

			const numColumnsRemainingFromRow = fields.length % 3;
			if (numColumnsRemainingFromRow !== 0) {
				for (let i = 0; i < numColumnsRemainingFromRow; i += 1) {
					fields.push({
						name: '\u200b',
						value: '\u200b',
						inline: true,
					});
				}
			}

			message.author.send({embed: {
					color: 0x00ff00,
					author: {
						name: message.member.user.tag,
						icon_url: message.member.user.avatarURL,
					},
					title: `For help with a specific command, type \`${guildPrefix}help <command name>\``,
					url: '',
					description: 'Emojis show if you have permission to run the command',
					fields,
					timestamp: new Date(),
				}})
		} else {
			let command = client.commands.get(args[0]);
			if(!command){
				return message.reply('a command with that name does not exist.');
			}

			const embed = {
				color: 0x00ff00,
				author: {
					name: message.member.user.tag,
					icon_url: message.member.user.avatarURL,
				},
				title: `To see all commands, type \`${guildPrefix}help\``,
				url: '',
				description: 'Emojis show if you have permission to run the command',
				fields: [{
					name: `${command.allowedRoles.includes(user.role) || command.allowedRoles.length === 0 ? ':white_check_mark:' : ':x:'} ${command.name}`,
					value: `${command.description}`,
					inline: false,
				}],
				timestamp: new Date(),
			};
			message.author.send({embed});
		}
	},
};
