const { InvalidPasswordError } = require('../errors');

module.exports = ({ userDao, bcryptProvider, jwtProvider }) => {
	async function signIn({ email, password }) {
		const user = await userDao.findByEmail(email);
		const isPasswordCorrect = await bcryptProvider.compare(
			password,
			user.password
		);
		if (!isPasswordCorrect) throw new InvalidPasswordError();
		return {
			token: jwtProvider.sign({ email, name: user.name }),
			status: 1,
		};
	}

	return Object.freeze({ signIn });
};
