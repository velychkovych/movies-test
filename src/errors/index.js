class WrongCredentials extends Error {}

class ValidationError extends Error {}

class NotFoundError extends Error {}

module.exports = {
	WrongCredentials,
	ValidationError,
	NotFoundError,
};
