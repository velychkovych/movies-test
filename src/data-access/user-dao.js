const { NotFoundError } = require('../errors');

module.exports = (User) => {
	async function findByEmail(email) {
		const findUser = await User.findOne({ where: { email } });
		if (!findUser) throw new NotFoundError();
		return findUser.dataValues;
	}

	async function create(user) {
		const createUser = await User.create(user);
		return createUser.dataValues;
	}

	return Object.freeze({ findByEmail, create });
};
