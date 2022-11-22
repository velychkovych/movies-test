const sequelize = require('sequelize');
const { User, Movie, Actor } = require('../models');

const buildUserDao = require('./user-dao');
const buildMovieDao = require('./movie-dao');
const buildActorDao = require('./actor-dao');

const userDao = buildUserDao(User);
const movieDao = buildMovieDao(sequelize, Movie, Actor);
const actorDao = buildActorDao(Actor);

module.exports = Object.freeze({ userDao, movieDao, actorDao });
