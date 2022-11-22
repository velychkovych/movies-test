const config = {
	port: process.env.APP_PORT || 8000,
	bcryptRounds: 14,
	jwt: {
		secret: process.env.JWT_SECRET || 'some-secret',
		alg: 'HS256',
	},
};

module.exports = config;
