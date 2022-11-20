module.exports = (Actor) => {
	async function findManyByName(names) {
		const findActors = await Actor.findAll({ where: { name: names } });
		return findActors.map((actor) => actor.dataValues);
	}

	async function createMany(names) {
		const actors = names.map((name) => ({ name }));
		const createActors = await Actor.bulkCreate(actors);
		return createActors.map((actor) => actor.dataValues);
	}

	return Object.freeze({ findManyByName, createMany });
};
