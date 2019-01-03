const request = require('request-promise');
const config = require('../config');

exports.create = (commands) => {
    return new Promise(async (resolve) => {
        let options = {
            method: 'POST',
            uri: `${config.apiUrl}/commands`,
            body: {
               commands 
            },
            json: true
        };

        let user = await request(options);
        resolve(user.data[0]);
    });
};