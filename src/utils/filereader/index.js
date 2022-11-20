const fs = require('fs').promises;

module.exports = Object.freeze({
	readFile: (path) => fs.readFile(path, 'utf-8'),
});
