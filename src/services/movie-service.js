const { NotFoundError } = require('../errors');

module.exports = ({ movieDao, actorDao, movieValidator, fileService }) => {
	async function getAll({
		actor,
		title,
		search,
		sort,
		order,
		limit,
		offset,
	}) {
		const findAllMovies = (options) => {
			if (actor) return movieDao.findManyByActor(actor, options);
			if (title) return movieDao.findManyByTitle(title, options);
			if (search) return movieDao.findManyByActorOrTitle(search, options);
			return movieDao.findAll(options);
		};
		const validatedOptions = movieValidator.validateGetAll({
			sort,
			order,
			limit,
			offset,
		});
		const movies = await findAllMovies(validatedOptions);
		return {
			data: movies,
			status: 1,
		};
	}

	async function getById(id) {
		const movie = await movieDao.findById(id);
		if (!movie) throw new NotFoundError('movie not found');
		return {
			data: movie,
			status: 1,
		};
	}

	async function create(data) {
		const { title, year, format, actorNames } =
			movieValidator.validateCreate(data);
		const actors = await actorDao.findManyByName(actorNames);
		const notCreatedActors = actorNames.filter(
			(name) => !actors.map((actor) => actor.name).includes(name)
		);
		const createdActors = await actorDao.createMany(notCreatedActors);
		const movie = await movieDao.create({
			title,
			year,
			format,
			actorIds: [...actors, ...createdActors].map((actor) => actor.id),
		});
		movie.actors = [...actors, ...createdActors];
		return {
			data: movie,
			status: 1,
		};
	}

	async function importMany(files) {
		const file = await movieValidator.validateImportFile(files);
		const parsedMovies = await fileService.parseTxtFile(file);
		const actorNames = [
			...new Set(parsedMovies.flatMap((movie) => movie.actorNames)),
		];
		const actors = await actorDao.findManyByName(actorNames);
		const notCreatedActors = actorNames.filter(
			(name) => !actors.map((actor) => actor.name).includes(name)
		);
		const createdActors = await actorDao.createMany(notCreatedActors);
		const allActors = [...actors, ...createdActors];
		const movies = await movieDao.createMany(
			parsedMovies.map((movie) => ({
				info: {
					title: movie.title,
					year: movie.year,
					format: movie.format,
				},
				actorIds: movie.actorNames.map(
					(name) => allActors.find((actor) => actor.name === name).id
				),
			}))
		);
		return {
			data: movies,
			meta: { imported: movies.length, total: movies.length },
			status: 1,
		};
	}

	async function update(data) {
		const { title, year, format, actorNames } =
			movieValidator.validateUpdate(data);
		const actors = await actorDao.findManyByName(actorNames);
		const notCreatedActors = actorNames.filter(
			(name) => !actors.map((actor) => actor.name).includes(name)
		);
		const createdActors = await actorDao.createMany(notCreatedActors);
		const movie = await movieDao.update({
			id: data.id,
			title,
			year,
			format,
			actorIds:
				data.actorNames &&
				[...actors, ...createdActors].map((actor) => actor.id),
		});
		if (!movie) throw new NotFoundError('movie not found');
		if (data.actorNames) {
			movie.actors = [...actors, ...createdActors];
		}
		return {
			data: movie,
			status: 1,
		};
	}

	async function deleteById(id) {
		const deleted = await movieDao.deleteById(id);
		if (!deleted) throw new NotFoundError('movie not found');
		return { status: 1 };
	}

	return Object.freeze({
		getAll,
		getById,
		create,
		importMany,
		update,
		deleteById,
	});
};
