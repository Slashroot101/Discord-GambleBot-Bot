const moment = require('moment');

module.exports = (startDate, endDate, withSuffix) => {
  const availableTime = moment(endDate);
  const timeDifference = availableTime.diff(moment(startDate));
  return duration = moment.duration(timeDifference).humanize(withSuffix);
};
