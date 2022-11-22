const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middlewares/error-handler');
const jwtMiddleware = require('./middlewares/jwt-middleware');

const authController = require('./controllers/auth-controller');
const userController = require('./controllers/user-controller');
const movieController = require('./controllers/movie-controller');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/sessions', authController);
app.use('/api/v1/users', userController);
app.use('/api/v1/movies', movieController);

app.use(errorHandler);

app.listen(config.port, () => {
	console.log(`App listen on port ${config.port}`);
});
