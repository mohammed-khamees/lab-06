'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

routes controllers
const {
	homeHandler,
	locationHandler,
	weatherHandler,
	parkHandler,
	notFoundRouteHandler,
	errorHandler,
} = require('./controllers/modules');

const app = express();

app.use(cors());

//routes
app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/parks', parkHandler);
app.get('*', notFoundRouteHandler);
app.use(errorHandler);


//app listening
const PORT = process.env.PORT_env || 3000;
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
