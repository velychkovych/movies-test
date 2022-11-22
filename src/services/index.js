const { userDao, movieDao, actorDao } = require('../data-access');
const bcryptProvider = require('../utils/bcrypt-provider');
const jwtProvider = require('../utils/jwt-provider');
const fileReader = require('../utils/filereader');

const userValidator = require('./validators/user-validator');
const movieValidator = require('./validators/movie-validator');

const buildAuthService = require('./auth-service');
const buildUserService = require('./user-service');
const buildMovieService = require('./movie-service');

const authService = buildAuthService({ userDao, bcryptProvider, jwtProvider });
const userService = buildUserService({
	userDao,
	userValidator,
	bcryptProvider,
	jwtProvider,
});
const movieService = buildMovieService({
	movieDao,
	actorDao,
	movieValidator,
	fileReader,
});

module.exports = Object.freeze({ authService, userService, movieService });
