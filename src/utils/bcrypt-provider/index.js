const bcrypt = require('bcrypt');
const config = require('../../config');

module.exports = Object.freeze({
	hash: (plainPassword, rounds = config.bcryptRounds) =>
		bcrypt.hash(plainPassword, rounds),
	compare: (plainPassword, hash) => bcrypt.compare(plainPassword, hash),
});
