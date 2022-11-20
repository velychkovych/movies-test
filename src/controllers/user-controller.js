const express = require('express');
const { userService } = require('../services');
const errorCatcher = require('../middlewares/error-catcher');

const userController = express.Router();

userController.post(
	'/',
	errorCatcher(async (req, res) => {
		const result = await userService.create({
			email: req.body.email,
			name: req.body.name,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
		});
		res.status(200).send(result);
	})
);

module.exports = userController;
