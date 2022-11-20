const express = require('express');
const { authService } = require('../services');
const errorCatcher = require('../middlewares/error-catcher');

const authController = express.Router();

authController.post(
	'/',
	errorCatcher(async (req, res) => {
		const result = await authService.signIn({
			email: req.body.email,
			password: req.body.password,
		});
		res.status(200).send(result);
	})
);

module.exports = authController;
