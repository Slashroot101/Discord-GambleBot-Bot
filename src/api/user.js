const request = require('request-promise');
const config = require('../../config');

const BASE_URL = 'api/users/';

exports.getWithFilter = async (query) => {
  const options = {
    method: 'GET',
    uri: `${config.apiUrl}/${BASE_URL}`,
    qs: query,
    json: true,
  };
  const users = await request(options);
  return users.users;
};

exports.createUser = async (discordUserID, role) => {
  const options ={
    method: 'POST',
    uri: `${config.apiUrl}/${BASE_URL}`,
    body: {
      discordUserID,
      role,
    },
    json: true
  };

  const user = await request(options);
  return user.user;
};

exports.updateUser = async(userID, body) => {
	const options ={
		method: 'PUT',
		uri: `${config.apiUrl}/${BASE_URL}${userID}`,
		body,
		json: true
	  };
	
	  const user = await request(options);
	  return user.user;
};

exports.addPointsToUser = async(userID, commandID, points) => {
  const options ={
    method: 'PUT',
    uri: `${config.apiUrl}/${BASE_URL}${userID}/command/${commandID}/points`,
    body: {
      points,
    },
    json: true
  };

  const user = await request(options);
  return user.user;
};
