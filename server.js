'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

//routes controllers
// const {
// 	homeHandler,
// 	locationHandler,
// 	weatherHandler,
// 	parkHandler,
// 	notFoundRouteHandler,
// 	errorHandler,
// } = require('./controllers/modules');

const app = express();

app.use(cors());

//routes
app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/parks', parkHandler);
app.get('*', notFoundRouteHandler);
app.use(errorHandler);

//handlers
function homeHandler(req, res) {
	res.send('Home Page');
}

function locationHandler(req, res) {
	let city = req.query.city;

	let key = process.env.GEOCODE_API_KEY;
	let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

	superagent.get(url).then((data) => {
		const locationData = new Location(city, data.body[0]);
		res.status(200).json(locationData);
	});
}

function weatherHandler(req, res) {
	let lat = req.query.lat;
	let lon = req.query.lon;

	let key = process.env.WEATHER_API_KEY;
	let url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${key}&include=minutely`;

	superagent.get(url).then((data) => {
		const locData = data.body;
		const weatherData = locData.data.map((el) => {
			return new Weather(el);
		});
		res.status(200).json(weatherData);
	});
}

function parkHandler(req, res) {
	let parkCode = req.query.parkCode;

	let key = process.env.PARKS_API_KEY;
	let url = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=${key}`;

	superagent.get(url).then((data) => {
		const locData = data.body;

		const parkData = locData.data.map((el) => {
			return new Park(el);
		});
		res.status(200).json(parkData);
	});
}

function notFoundRouteHandler(req, res) {
	res.status(404).send('Page Not Found');
}

function errorHandler(error, req, res) {
	res.status(500).send(error);
}

//constructors functions
function Location(city, data) {
	this.search_query = city;
	this.formatted_query = data.display_name;
	this.latitude = data.lat;
	this.longitude = data.lon;
}

function Weather(data) {
	this.forecast = data.weather.description;
	this.time = data.datetime;
}

function Park(data) {
	this.name = data.fullName;
	this.address = data.addresses.map((address) => {
		return `${address.line1}. ${address.city} ${address.stateCode} ${address.postalCode}`;
	})[0];
	this.fee = '0.00';
	this.description = data.description;
	this.url = data.url;
}

//app listening
const PORT = process.env.PORT_env || 3000;
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
