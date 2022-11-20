const express = require('express');
const fileUpload = require('express-fileupload');
const { movieService } = require('../services');
const errorCatcher = require('../middlewares/error-catcher');

const movieController = express.Router();

movieController.get(
	'/',
	errorCatcher(async (req, res) => {
		const result = await movieService.getAll({
			actor: req.query.actor,
			title: req.query.title,
			search: req.query.search,
			sort: req.query.sort,
			order: req.query.order,
			limit: req.query.limit,
			offset: req.query.offset,
		});
		res.status(200).send(result);
	})
);

movieController.get(
	'/:id',
	errorCatcher(async (req, res) => {
		const result = await movieService.getById(req.params.id);
		res.status(200).send(result);
	})
);

movieController.post(
	'/',
	errorCatcher(async (req, res) => {
		const result = await movieService.create({
			title: req.body.title,
			year: req.body.year,
			format: req.body.format,
			actorNames: req.body.actors,
		});
		res.status(200).send(result);
	})
);

movieController.post(
	'/import/',
	fileUpload({ createParentPath: true, useTempFiles: true }),
	errorCatcher(async (req, res) => {
		const result = await movieService.importMany(req.files.movies);
		res.status(200).send(result);
	})
);

movieController.patch(
	'/:id',
	errorCatcher(async (req, res) => {
		const result = await movieService.update({
			id: req.params.id,
			title: req.body.title,
			year: req.body.year,
			format: req.body.format,
			actorNames: req.body.actors,
		});
		res.status(200).send(result);
	})
);

movieController.delete(
	'/:id',
	errorCatcher(async (req, res) => {
		const result = await movieService.deleteById(req.params.id);
		res.status(200).send(result);
	})
);

module.exports = movieController;
