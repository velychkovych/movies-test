module.exports = Object.freeze({
	validate: ({ sort = 'id', order = 'ASC', limit = 20, offset = 0 }) => {
		const validatedSort = ['id', 'title', 'year'].includes(sort)
			? sort
			: 'id';
		const validatedOrder = ['ASC', 'DESC'].includes(order) ? order : 'ASC';
		const validatedLimit = limit > 0 ? limit : 20;
		const validatedOffset = offset >= 0 ? offset : 0;
		return {
			sort: validatedSort,
			order: validatedOrder,
			limit: validatedLimit,
			offset: validatedOffset,
		};
	},
});
