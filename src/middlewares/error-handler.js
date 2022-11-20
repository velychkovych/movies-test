const { ValidationError } = require('sequelize');
const { UnauthorizedError } = require('express-jwt');
const {
	DifferentPasswordError,
	InvalidPasswordError,
	NotFoundError,
} = require('../errors');
const responseCodes = require('../constants/responses');

module.exports = (error, req, res, next) => {
	if (error instanceof ValidationError) {
		const errorMessage = error.errors.map((err) => err.path).join(',');
		res.status(responseCodes.BAD_REQUEST).send({
			msg: `${errorMessage} invalid`,
		});
	} else if (error instanceof DifferentPasswordError) {
		res.status(responseCodes.BAD_REQUEST).send({
			msg: 'passwords are different',
		});
	} else if (error instanceof UnauthorizedError) {
		res.status(responseCodes.UNAUTHORIZED).send({
			msg: 'auth token required',
		});
	} else if (error instanceof InvalidPasswordError) {
		res.status(responseCodes.FORBIDDEN).send({
			msg: 'invalid email or password',
		});
	} else if (error instanceof NotFoundError) {
		res.status(responseCodes.NOT_FOUND).send({ msg: 'entity not found' });
	} else {
		console.error(error);
		res.status(responseCodes.INTERNAL_SERVER_ERROR).send(error.name);
	}
};
