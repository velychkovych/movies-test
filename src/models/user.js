module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('Users', {
		email: {
			type: DataTypes.STRING,
			allownull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	});
	return User;
};
