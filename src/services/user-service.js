const { DifferentPasswordError } = require('../errors');

module.exports = ({ userDao, bcryptProvider, jwtProvider }) => {
	async function create({ email, name, password, confirmPassword }) {
		if (password !== confirmPassword || !password)
			throw new DifferentPasswordError();
		const encryptedPassword = await bcryptProvider.hash(password);
		const user = await userDao.create({
			email,
			name,
			password: encryptedPassword,
		});
		return {
			token: jwtProvider.sign({ email, name: user.name }),
			status: 1,
		};
	}

	return Object.freeze({ create });
};
