const { ValidationError } = require('../../errors');

const formatWords = (words) =>
	words
		.trim()
		.split(' ')
		.filter((text) => text !== '')
		.join(' ');

module.exports = Object.freeze({
	validateGetAll: ({
		sort = 'id',
		order = 'ASC',
		limit = 20,
		offset = 0,
	}) => {
		const validated = {};

		validated.sort = ['id', 'title', 'year'].includes(sort) ? sort : 'id';
		validated.order = ['ASC', 'DESC'].includes(order) ? order : 'ASC';
		validated.limit = limit > 0 ? limit : 20;
		validated.offset = offset >= 0 ? offset : 0;
		return validated;
	},

	validateCreate: ({ title, year, format, actorNames = [] }) => {
		const validated = {};

		validated.title = formatWords(title);
		if (!validated.title)
			throw new ValidationError('title should contain at least 1 word');

		validated.year = parseInt(String(year), 10);
		if (
			!(
				String(year).match(/^[0-9]{4}$/) &&
				validated.year >= 1900 &&
				validated.year <= 2022
			)
		)
			throw new ValidationError(
				'year should be a number and between 1900 and 2022'
			);

		validated.format = format;
		if (!['VHS', 'DVD', 'Blu-ray'].includes(format))
			throw new ValidationError(
				'format should be one of the following values: VHS, DVD, Blu-ray'
			);

		const formatedActors = actorNames.map((name) =>
			name
				.trim()
				.split(' ')
				.filter((text) => text !== '')
				.join(' ')
		);
		validated.actorNames = formatedActors;
		return validated;
	},
	validateUpdate: ({ title, year, format, actorNames = [] }) => {
		const validated = {};

		if (title) {
			validated.title = formatWords(title);
			if (!validated.title)
				throw new ValidationError(
					'title should contain at least 1 word'
				);
		}

		if (year) {
			validated.year = parseInt(String(year), 10);
			if (
				!(
					String(year).match(/^[0-9]{4}$/) &&
					validated.year >= 1900 &&
					validated.year <= 2022
				)
			)
				throw new ValidationError(
					'year should be a number and between 1900 and 2022'
				);
		}

		if (format) {
			validated.format = format;
			if (!['VHS', 'DVD', 'Blu-ray'].includes(format))
				throw new ValidationError(
					'format should be one of the following values: VHS, DVD, Blu-ray'
				);
		}

		if (actorNames) {
			const formatedActors = actorNames.map((name) => formatWords(name));
			validated.actorNames = formatedActors;
		}

		return validated;
	},
	validateImportFile: (files) => {
		if (!files) throw new ValidationError('no files provided');
		const file = files.movies;
		if (!file) throw new ValidationError('file key should be movies');
		if (file.name.split('.')[1] !== 'txt')
			throw new ValidationError('file format should be txt');
		return file;
	},
});
