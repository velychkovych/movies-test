module.exports = ({ fileReader, movieValidator }) => {
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
			const actorNames = records[i + 3]
				.replace('Stars: ', '')
				.split(', ');
			parsedMovies.push({
				title,
				year,
				format,
				actorNames,
			});
		}
		return parsedMovies;
	};

	async function parseTxtFile(file) {
		const data = await fileReader.readFile(file.tempFilePath);
		const parsedMovies = parseMovies(data.toString().split('\n'));
		return parsedMovies.map((movie) =>
			movieValidator.validateCreate(movie)
		);
	}

	return Object.freeze({
		parseTxtFile,
	});
};
