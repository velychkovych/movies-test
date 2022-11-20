module.exports = ({ movieDao, actorDao, listMoviesValidator, fileReader }) => {
	const parseMovies = (records) => {
		const parsedMovies = [];
		for (let i = 0; i < records.length; i += 5) {
			if (!records[i]) break;
			const title = records[i].replace('Title: ', '');
			const year = parseInt(
				records[i + 1].replace('Release Year: ', ''),
				10
			);
			const format = records[i + 2].replace('Format: ', '');
			const actors = records[i + 3].replace('Stars: ', '').split(', ');
			parsedMovies.push({
				title,
				year,
				format,
				actors,
			});
		}
		return parsedMovies;
	};

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
		const validatedOptions = listMoviesValidator.validate({
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
		return {
			data: movie,
			status: 1,
		};
	}

	async function create({ title, year, format, actorNames }) {
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

	async function importMany(file) {
		const data = await fileReader.readFile(file.tempFilePath);
		const parsedMovies = parseMovies(data.toString().split('\n'));
		const actorNames = [
			...new Set(parsedMovies.flatMap((movie) => movie.actors)),
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
				actorIds: movie.actors.map(
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

	async function update({ id, title, year, format, actorNames }) {
		const actors = await actorDao.findManyByName(actorNames);
		const notCreatedActors = actorNames.filter(
			(name) => !actors.map((actor) => actor.name).includes(name)
		);
		const createdActors = await actorDao.createMany(notCreatedActors);
		console.log(actors, createdActors);
		const movie = await movieDao.update({
			id,
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

	async function deleteById(id) {
		await movieDao.deleteById(id);
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
