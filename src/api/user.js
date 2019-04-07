const request = require('request-promise');
const config = require('../../config');

const BASE_URL = 'api/users/';

exports.getUser = async (query) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/${BASE_URL}`,
    qs: query,
    json: true,
  };

  const user = await request(options);
  return user.users;
};
