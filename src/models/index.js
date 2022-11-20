const { Sequelize, DataTypes } = require('sequelize');

const buildUser = require('./user');
const buildMovie = require('./movie');
const buildActor = require('./actor');
const buildMovieActor = require('./movie-actor');

const sequelize = new Sequelize('sqlite::memory:', {
	logging: console.log,
});

sequelize
	.authenticate()
	.then(() => console.log('Connection has been established successfully.'))
	.catch((error) =>
		console.error('Unable to connect to the database:', error)
	);

const User = buildUser(sequelize, DataTypes);
const Movie = buildMovie(sequelize, DataTypes);
const Actor = buildActor(sequelize, DataTypes);

const MovieActor = buildMovieActor(sequelize, Movie, Actor);

const models = {
	User,
	Movie,
	Actor,
	MovieActor,
};

Object.values(models).map((model) => model.sync());

module.exports = models;
