const { ValidationError } = require('../../errors');

module.exports = Object.freeze({
	validateCreate: ({ email, name, password, confirmPassword }) => {
		if (
			!String(email)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				)
		)
			throw new ValidationError('email is invalid');

		const wordsInName = name
			.trim()
			.split(' ')
			.filter((text) => text !== '').length;
		if (wordsInName < 1 || wordsInName > 2)
			throw new ValidationError('name should consist of 1 or 2 words');

		if (!password.match(/^[a-zA-Z0-9$&+,:;=?@#|'<>.^*()%!-]{6,20}$/))
			throw new ValidationError(
				'password should not contain spaces and have a length between 6 and 20'
			);

		if (password !== confirmPassword)
			throw new ValidationError('passwords are different');

		return {
			email,
			name: name
				.trim()
				.split(' ')
				.filter((text) => text !== '')
				.join(' '),
			password,
		};
	},
});
