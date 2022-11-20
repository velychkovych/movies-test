module.exports = (sequelize, Movie, Actor) => {
	const MovieActor = sequelize.define('Movies_Actors', {});
	Movie.belongsToMany(Actor, {
		through: MovieActor,
	});

	Actor.belongsToMany(Movie, {
		through: MovieActor,
	});
	return MovieActor;
};
