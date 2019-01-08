const moment = require('moment');

module.exports = function(startTime, endTime){
	const duration = moment.duration(endTime.diff(startTime));
	duration.humanize(true)
	const hours = duration.asHours();
	const minutes = duration.asMinutes();
	const seconds = duration.asSeconds();
};