module.exports = {
    name: 'bal',
    description: 'Balance',
    duration: 6000,
    usages: 11,
    async execute(client, message, args, user) {

        let embed= {
            color: 0x00ff00,
            author: {
              name: message.member.user.tag,
              icon_url: message.member.user.avatarURL
            },
            title: "",
            url: "",
            description: ``,
            fields: [
              {
                name: "**Current Balance**",
                value: `${user.current_balance}`,
                inline: true
              },
              {
                name: "**Total Money Gained**",
                value: `${user.total_points_gained}`,
                inline: true
              }
            ],
            timestamp: new Date()
          }
          
        return message.channel.send({embed});
    }
};