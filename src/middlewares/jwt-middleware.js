const { expressjwt: jwt } = require('express-jwt');
const config = require('../config');

module.exports = jwt({
	secret: config.jwt.secret,
	algorithms: [config.jwt.alg],
});
