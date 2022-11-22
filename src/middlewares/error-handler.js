// const { ValidationError } = require('sequelize');
const { UnauthorizedError } = require('express-jwt');
const {
	ValidationError,
	WrongCredentials,
	NotFoundError,
} = require('../errors');
const responseCodes = require('../constants/responses');

module.exports = (error, req, res, next) => {
	if (error instanceof ValidationError) {
		res.status(responseCodes.BAD_REQUEST).send({
			msg: error.message,
		});
	} else if (error instanceof UnauthorizedError) {
		res.status(responseCodes.UNAUTHORIZED).send({
			msg: 'wrong auth token',
		});
	} else if (error instanceof WrongCredentials) {
		res.status(responseCodes.FORBIDDEN).send({
			msg: 'invalid email or password',
		});
	} else if (error instanceof NotFoundError) {
		res.status(responseCodes.NOT_FOUND).send({ msg: error.message });
	} else {
		console.error(error);
		res.status(responseCodes.INTERNAL_SERVER_ERROR).send(error.name);
	}
};
