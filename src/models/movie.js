module.exports = (sequelize, DataTypes) => {
	const Movie = sequelize.define('Movies', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1900,
				max: 2022,
			},
		},
		format: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isIn: [['VHS', 'DVD', 'Blu-ray']],
			},
		},
	});
	return Movie;
};
