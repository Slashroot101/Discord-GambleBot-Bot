exports.pickFirstChannelInGuild = (channels) => {
  let channel;
  for (const c of channels) {
    const channelType = c[1].type;
    if (channelType === 'text') {
      channel = c[1];
      break;
    }
  }

  return channel;
};
