const User = require('../api/user');
const Points = require('../api/points');

module.exports = {
	name: 'pay',
	description: 'Gives money to a user from YOUR account. Ex: `!pay <@user> <amount>|<all>`',
	requiresAdmin: false,
	duration: 1,
	hasCooldown: true,
	generatesMoney: false,
	usages: 2,
	async execute(client, message, args, user) {
		const amount = args[1] === 'all' || args[1] === 'ALL' ? user.current_balance : Math.floor(Number(parseInt(args[1])));
		if(isNaN(amount)) {
			message.reply(' the amount must be a number or ALL.');
			return;
		}

		if(amount <= 0) {
			message.reply(' the amount bust be greater than 0.');
			return;
		}

		if(amount > user.current_balance) {
			message.reply(` you cannot afford that. You currently only have $${user.current_balance}, and that would require $${amount - user.current_balance} more.`);
			return;
		}

		const discordID = args[0].replace(/[^0-9]/g, '');

		if(isNaN(discordID) || discordID === '') {
			message.reply('please enter a valid user. Such as `!ban @user <reason>`');
			return;
		}

		const personToPay = await User.getUserByDiscordID(discordID);

		if(message.member.id === personToPay.discord_user_id){
			message.reply('you cannot pay yourself!');
			return;
		}

		if(personToPay.length === 0) {
			message.reply(' that user has never run a command.');
			return;
		}

		await Points.addPointsByUserID(personToPay.user_id, amount);
		await Points.addPointsByUserID(user.user_id, amount * -1)

		message.reply(`succesfully paid $${amount} to ${args[0]}. Your balance is now ${user.current_balance - amount}.`);
	},
};