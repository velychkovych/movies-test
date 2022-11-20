const { Op } = require('sequelize');
const { NotFoundError } = require('../errors');

module.exports = (Movie, Actor) => {
	const formatMovie = (movie) => {
		if (movie.Actors) {
			movie.actors = movie.Actors.map((actor) => {
				delete actor.dataValues.Movies_Actors;
				return actor.dataValues;
			});
			delete movie.Actors;
		}
		return movie;
	};

	async function findManyByActor(actor, { sort, order, limit, offset }) {
		const findMovies = await Movie.findAll({
			order: [[sort, order]],
			limit,
			offset,
			include: {
				model: Actor,
				where: {
					name: {
						[Op.substring]: actor,
					},
				},
			},
		});
		return findMovies.map((findMovie) => formatMovie(findMovie.dataValues));
	}

	async function findManyByTitle(title, { sort, order, limit, offset }) {
		const findMovies = await Movie.findAll({
			where: { title },
			order: [[sort, order]],
			limit,
			offset,
			include: Actor,
		});
		return findMovies.map((findMovie) => formatMovie(findMovie.dataValues));
	}

	async function findManyByActorOrTitle(search, options) {
		const moviesByActor = await findManyByActor(search, options);
		const moviesByTitle = await findManyByTitle(search, options);
		return [...moviesByActor, ...moviesByTitle];
	}

	async function findAll({ sort, order, limit, offset }) {
		const findMovies = await Movie.findAll({
			order: [[sort, order]],
			limit,
			offset,
			include: Actor,
		});
		return findMovies.map((findMovie) => formatMovie(findMovie.dataValues));
	}

	async function findById(id) {
		const findMovie = await Movie.findOne({
			where: { id },
			include: Actor,
		});
		if (!findMovie) throw new NotFoundError();
		console.log(findMovie);
		return formatMovie(findMovie.dataValues);
	}

	async function create({ title, year, format, actorIds }) {
		const createMovie = await Movie.create({ title, year, format });
		createMovie.setActors(actorIds);
		return formatMovie(createMovie.dataValues);
	}

	async function createMany(movies) {
		const moviesInfo = movies.map((movie) => movie.info);
		const moviesActorIds = movies.map((movie) => movie.actorIds);
		const createMovies = await Movie.bulkCreate(moviesInfo);
		for (let i = 0; i < createMovies.length; i += 1) {
			createMovies[i].setActors(moviesActorIds[i]);
		}
		return createMovies.map((createMovie) => createMovie.dataValues);
	}

	async function update({ id, title, year, format, actorIds }) {
		const findMovie = await Movie.findOne({ where: { id } });
		if (!findMovie) throw new NotFoundError();
		findMovie.set({ title, year, format });
		findMovie.setActors(actorIds);
		return formatMovie(findMovie.dataValues);
	}

	async function deleteById(id) {
		const deleteMovie = await Movie.destroy({ where: { id } });
		if (!deleteMovie) throw new NotFoundError();
		return deleteMovie;
	}

	return Object.freeze({
		findManyByActor,
		findManyByTitle,
		findManyByActorOrTitle,
		findAll,
		findById,
		create,
		createMany,
		update,
		deleteById,
	});
};
