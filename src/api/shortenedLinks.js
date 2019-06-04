const BASE_URL = 'api/short-link/';


exports.update = (id, body) => {
	const options ={
			method: 'PUT',
			uri: `${config.apiUrl}/${BASE_URL}${id}`,
			body,
			json: true
	  };
	
	  const shortLink = await request(options);
	  return shortLink.shortLink;
};