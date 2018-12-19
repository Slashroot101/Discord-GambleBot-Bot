
exports.gameBoard = function(message, text){return {embed: {
    color: 3447003,
    author: {
      name: message.member.user.tag,
      icon_url: message.member.user.avatarURL
    },
    title: "",
    url: "",
    description: "Type `hit` to draw another card or `stand` to pass.",
    fields: [
      {
        name: "**Your Hand**",
        value: `${text.clientString}`,
        inline: true
      },
      {
        name: "**Dealer Hand**",
        value: `${text.dealerString}`,
        inline: true
      },
      {
        name: "\u200b",
        value: `\u200b`,
        inline: true
      },
      {
        name: "\u200b",
        value: `Value: ${text.clientSum}`,
        inline: true
      },
      {
        name: "\u200b",
        value: `Value: ${text.dealerSum} `,
        inline: true
      },
      {
        name: "\u200b",
        value: `\u200b`,
        inline: true
      },
    ],
    timestamp: new Date()
  }
}};

exports.winnerBoard = function(message, text){
    return {
        embed: {
            color: text.color,
            author: {
              name: message.member.user.tag,
              icon_url: message.member.user.avatarURL
            },
            title: "",
            url: "",
            description: `Result: ${text.result}`,
            fields: [
              {
                name: "**Your Hand**",
                value: `${text.clientString}`,
                inline: true
              },
              {
                name: "**Dealer Hand**",
                value: `${text.dealerString}`,
                inline: true
              },
              {
                name: "\u200b",
                value: `\u200b`,
                inline: true
              },
              {
                name: "\u200b",
                value: `Value: ${text.clientSum}`,
                inline: true
              },
              {
                name: "\u200b",
                value: `Value: ${text.dealerSum} `,
                inline: true
              },
              {
                name: "\u200b",
                value: `\u200b`,
                inline: true
              },
            ],
            timestamp: new Date()
          }
    }
}
