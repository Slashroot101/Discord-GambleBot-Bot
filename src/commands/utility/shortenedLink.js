const WELL_FORMED_URL  = require('../../constants').regex.WELL_FORMED_URL;
const ShortenedLink = require('../../api/shortenedLinks');

module.exports = {
	name: 'shorten',
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
    if(!url.match(WELL_FORMED_URL)){
      return message.reply('That is not a valid URL. Please provide a valid URL that begins with http:// or https://');
    }

    const shortLink = await ShortenedLink.getWithFilter({originalUrl: url});

    if(shortLink.shortenedLinks.length > 0){

      if(!shortLink.shortenedLinks[0].createdBy.includes(user._id)){
        await ShortenedLink.update(shortLink.shortenedLinks[0]._id, {createdBy: user._id});
      }

      return message.reply(`${shortLink.hostname}/${shortLink.shortenedLinks[0].shortCode}`);
    }

    
		
	},
};
