module.exports = (User) => {
	async function findByEmail(email) {
		const findUser = await User.findOne({ where: { email } });
		if (!findUser) return null;
		return findUser.dataValues;
	}

	async function create(user) {
		const createUser = await User.create(user);
		return createUser.dataValues;
	}

	return Object.freeze({ findByEmail, create });
};
