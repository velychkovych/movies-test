module.exports = (sequelize, DataTypes) => {
	const Movie = sequelize.define('Actors', {
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
	});
	return Movie;
};
