const BASE_URL = 'api/short-link/';


exports.update = (id, body) => {
	const options ={
			method: 'PUT',
			uri: `${config.apiUrl}/${BASE_URL}${id}`,
			body,
			json: true,
	  };
	
	  const shortLink = await request(options);
	  return shortLink.shortLink;
};

exports.getWithFilter = (query) =>  {
	const options = {
		method: 'GET',
		uri: `${config.apiUrl}/${BASE_URL}`,
		qs: query,
		json: true,
	};

	const shortenedLinks = await request(options);
	return shortenedLinks.shortenedLinks;
};

exports.create = (body) => {
	const options = {
		method: 'POST',
		uri: `${config.apiUrl}/${BASE_URL}`,
		json: true,
	};

	const shortenedLink = await request(options);

	if(shortenedLink.statusCode === 500){
		return new Error('the provided website is not live. Please provide a live website');
	}

	return shortenedLink.shortenedLink;
};