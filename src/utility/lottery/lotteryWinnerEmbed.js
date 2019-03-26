exports.lotteryWinnerEmbed = (winnerID, jackpotTotal) => {
  const embed = {
    color: 0x00ff00,
    title: 'Lottery Results',
    url: '',
    description: `**Jackpot Total**: $${jackpotTotal} :moneybag: `,
    fields: [
      {
        name: '\u200b',
        value: `<@${winnerID}> is the winner!`,
        inline: true,
      },
    ],
    timestamp: new Date(),
  };

  return embed;
};
