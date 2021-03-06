const WELL_FORMED_URL  = require('../../constants').regex.WELL_FORMED_URL;
const ShortenedLink = require('../../api/shortenedLinks');

module.exports = {
	name: 'short',
	description: 'Shortens a link: `Ex: {0}shorten https://google.com`',
	costData: {
		cost: 0,
		hasCost: false,
	},
	cooldown: {
		hasCooldown: false,
		executions: 1,
		cooldownInMinutes: 2
	},
	group: 'Utility',
	allowedRoles: [
	],
	async execute(client, message, args, user) {
		if(args.length === 0){
      return message.reply(' you must provide a URL to shorten');
    }

    const url = args[0];
    if(!new RegExp(WELL_FORMED_URL).test(url)){
      return message.reply('That is not a valid URL. Please provide a valid URL that begins with http:// or https://');
    }

    let shortLink = await ShortenedLink.getWithFilter({originalUrl: url});
    if(shortLink.shortenedLinks.length > 0){

      if(!shortLink.shortenedLinks[0].createdBy.includes(user._id)){
        await ShortenedLink.update(shortLink.shortenedLinks[0]._id, {createdBy: user._id});
      }

      return message.reply(`http://${shortLink.hostname}/${shortLink.shortenedLinks[0].shortCode}`);
    } 

		try {
			shortLink = await ShortenedLink.create({originalUrl: url, createdBy: [user._id]});
			message.reply(`Shortened! http://${shortLink.shortenedLink.hostname}/${shortLink.shortenedLink.shortCode}`)
		} catch (err){
			message.reply('the provided url is not live. Please provide a live website');
		}
	},
};
