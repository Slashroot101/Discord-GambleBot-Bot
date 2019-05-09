const Lottery = require('../api/lottery');
const constants = require('../constants');
const Guild = require('../api/guild');
const User = require('../api/user');
const lotteryWinnerEmbed = require('../utility/lottery/lotteryWinnerEmbed');

module.exports = async (queuedMessage, client) => {
	const parsedLottery = JSON.parse(queuedMessage);
	const winner = await Lottery.pickAndSetWinner(parsedLottery._id);
	if(winner.localityType === constants.lottery.localityType.guild){
		const [guild, user] = await Promise.all([
			Guild.getGuildWithFilter({id: winner.guildID}),
			User.getWithFilter({
				'ids[]': winner.winner
			}),
		]);

		const channel = client.channels.get(guild[0].communicationChannel.discordChannelID) || client.channels.get(winner.createdInChannel);
		await channel.send({ embed: lotteryWinnerEmbed(user[0].discordUserID, winner.currentJackpot)});
		await User.addPointsToUser(winner.winner, client.commands.get('lottery'), winner.currentJackpot);
		await Lottery.update(winner._id, {isDone: true});
	} else {

	}
};
