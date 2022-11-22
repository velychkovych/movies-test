module.exports = (sequelize, Movie, Actor) => {
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
						[sequelize.Op.substring]: actor,
					},
				},
			},
		});
		return findMovies.map((findMovie) => formatMovie(findMovie.dataValues));
	}

	async function findManyByTitle(title, { sort, order, limit, offset }) {
		const findMovies = await Movie.findAll({
			where: {
				title: sequelize.where(
					sequelize.fn('LOWER', sequelize.col('title')),
					'LIKE',
					`%${title}%`
				),
			},
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
			order: [[sequelize.fn('lower', sequelize.col(sort)), order]],
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
		if (!findMovie) return null;
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
		const findMovie = await Movie.findOne({
			where: { id },
			include: Actor,
		});
		if (!findMovie) return null;
		const vals = {
			title,
			year,
			format,
		};
		findMovie.set(JSON.parse(JSON.stringify(vals)));
		findMovie.save();
		if (actorIds) {
			findMovie.setActors(actorIds);
		}
		return formatMovie(findMovie.dataValues);
	}

	async function deleteById(id) {
		const deleteMovie = await Movie.destroy({ where: { id } });
		if (!deleteMovie) return null;
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
