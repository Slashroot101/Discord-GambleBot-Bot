module.exports = {
    name: 'ping',
    description: 'Ping!',
    duration: 60,
    usages: 1,
    execute(client, message, args) {
        message.channel.send('Pong.');
    }
};