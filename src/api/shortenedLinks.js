const BASE_URL = 'api/short-link/';
const config = require('../../config');
const request = require('request-promise');

exports.update = async (id, body) => {
	const options ={
			method: 'PUT',
			uri: `${config.apiUrl}/${BASE_URL}${id}`,
			body,
			json: true,
	  };
	
	  const shortLink = await request(options);
	  return shortLink;
};

exports.getWithFilter = async (query) =>  {
	const options = {
		method: 'GET',
		uri: `${config.apiUrl}/${BASE_URL}`,
		qs: query,
		json: true,
	};

	const shortenedLinks = await request(options);
	return shortenedLinks;
};

exports.create = async (body) => {
	const options = {
		method: 'POST',
		uri: `${config.apiUrl}/${BASE_URL}`,
		body,
		json: true,
	};

	const shortenedLink = await request(options);

	if(shortenedLink.statusCode === 500){
		return new Error('the provided website is not live. Please provide a live website');
	}

	return shortenedLink;
};