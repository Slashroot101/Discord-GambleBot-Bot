exports.pickFirstChannelInGuild = (channels) => {
  let channelID;
  for (const c of channels) {
    const channelType = c[1].type;
    if (channelType === 'text') {
      channelID = c[0];
      break;
    }
  }

  return channelID;
};
