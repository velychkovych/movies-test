class InvalidPasswordError extends Error {}

class DifferentPasswordError extends Error {}

class NotFoundError extends Error {}

module.exports = {
	InvalidPasswordError,
	DifferentPasswordError,
	NotFoundError,
};
