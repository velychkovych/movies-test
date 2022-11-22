const { WrongCredentials } = require('../errors');

module.exports = ({ userDao, bcryptProvider, jwtProvider }) => {
	async function signIn({ email, password }) {
		const user = await userDao.findByEmail(email);
		if (!user) throw new WrongCredentials();
		const isPasswordCorrect = await bcryptProvider.compare(
			password,
			user.password
		);
		if (!isPasswordCorrect) throw new WrongCredentials();
		return {
			token: jwtProvider.sign({ email, name: user.name }),
			status: 1,
		};
	}

	return Object.freeze({ signIn });
};
