module.exports = {
	name: 'net',
	description: 'See how much you have netted off of each command. `Ex: !net bj`',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	generatesMoney: false,
	execute(client, message) {
		message.channel.send('Pong.');
	},
};