const { ValidationError: DatabaseValidationError } = require('sequelize');
const { ValidationError } = require('../errors');

module.exports = ({ userDao, userValidator, bcryptProvider, jwtProvider }) => {
	async function create(data) {
		const { email, name, password } = userValidator.validateCreate(data);
		const encryptedPassword = await bcryptProvider.hash(password);
		console.log(name);
		try {
			const user = await userDao.create({
				email,
				name,
				password: encryptedPassword,
			});
			return {
				token: jwtProvider.sign({ email, name: user.name }),
				status: 1,
			};
		} catch (error) {
			if (error instanceof DatabaseValidationError)
				throw new ValidationError('email is already taken');
			else throw error;
		}
	}

	return Object.freeze({ create });
};
