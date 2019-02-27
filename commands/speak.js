module.exports = {
  name: 'speak',
  description: 'yoU\'lL JuSt hAVe To SEe. Ex: `!speak yoU\'lL JuSt hAVe To SEe.`',
  requiresAdmin: false,
  duration: 60,
  hasCooldown: false,
  generatesMoney: false,
  usages: 1,
  execute(client, message, args) {
    let ret = '';

    if (args.length === 0) {
      return message.reply('give me a phrase to translate. Such as !speak blah blah blah');
    }

    for (let i = 0; i < args.length; i++) {
      for (let j = 0; j < args[i].length; j++) {
        const isCaps = Math.floor((Math.random() * 3) + 1);
        if (isCaps === 1) {
          ret += args[i].charAt(j).toUpperCase();
        } else {
          ret += args[i].charAt(j).toLowerCase();
        }
      }
      ret += ' ';
    }

    message.reply(ret);
  },
};
