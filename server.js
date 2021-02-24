'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

//connect to database
const client = require('./database.js');

//import handlers
const locationHandler = require('./modules/location.js');
const weatherHandler = require('./modules/weather.js');
const parkHandler = require('./modules/parks.js');
const movieHandler = require('./modules/movie.js');
const yelpHandler = require('./modules/yelp.js');

const app = express();
const PORT = process.env.PORT_env || 3030;

app.use(cors());

//handlers
function homeHandler(req, res) {
	res.send('Home Page');
}

function notFoundRouteHandler(req, res) {
	res.status(404).json('Page Not Found');
}

function errorHandler(error, req, res) {
	res.status(500).json(error);
}

//routes
app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/parks', parkHandler);
app.get('/movies', movieHandler);
app.get('/yelp', yelpHandler);

app.get('*', notFoundRouteHandler);
app.use(errorHandler);

//app listening
client
	.connect()
	.then(() => {
		app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
	})
	.catch((error) => {
		console.log(error.message);
	});
