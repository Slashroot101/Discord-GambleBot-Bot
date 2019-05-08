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
			Guild.getGuildWithFilter({'discordGuildID[0]': winner.discordGuildID}),
			User.getWithFilter({
				'ids[]': winner.winner
			}),
		]);
		const channel = client.channels.get(guild.communicationChannel.discordChannelID) || client.channels.get(winner.createdInChannel);
		await channel.send({ embed: lotteryWinnerEmbed(user.discordUserID, winner.currentJackpot)});
	} else {

	}
};