const request = require('request-promise');
const config = require('../../config');
const BASE_URL = 'api/roles/';

exports.createRole = async (name, isSuperUser, hasAdmin) => {
	const options = {
		uri: `${config.apiUrl}/${BASE_URL}/`,
		method: 'POST',
		body: {
			name,
			isSuperUser,
			hasAdmin,
		},
		json: true,
	};

	const role = await request(options);
	return {role};
};

exports.getWithFilter = async (query) => {
	const options = {
		uri:`${config.apiUrl}/${BASE_URL}/`,
		qa: query,
		json: true,
	};

	const roles = await request(options);
	return {roles};
};