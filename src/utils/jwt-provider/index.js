const jsonwebtoken = require('jsonwebtoken');
const config = require('../../config');

module.exports = Object.freeze({
	sign: (object) => jsonwebtoken.sign(object, config.jwt.secret),
	verify: (token) => jsonwebtoken.verify(token, config.jwt.secret),
});
