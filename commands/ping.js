module.exports = {
	name: 'ping',
	description: 'Ping!',
	requiresAdmin: false,
	duration: 60,
	hasCooldown: false,
	usages: 1,
	execute(client, message) {
		message.channel.send('Pong.');
	},
};