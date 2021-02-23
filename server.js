'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');
const pg = require('pg');

const app = express();

app.use(cors());

const client = new pg.Client({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
});

// //handlers
function homeHandler(req, res) {
	res.send('Home Page');
}

function locationHandler(req, res) {
	let city = req.query.city;

	//data from API
	let key = process.env.GEOCODE_API_KEY;
	let url = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

	//data from database
	let SQL = `SELECT * FROM locations;`;

	client
		.query(SQL)
		.then((results) => {
			if (!city) {
				client.query(SQL).then((results) => {
					res.send(results.rows);
				});
			} else if (results.rows.find((row) => row.search_query === city)) {
				res.json(results.rows.find((row) => row.search_query === city));
			} else {
				superagent.get(url).then((data) => {
					const locationData = new Location(city, data.body[0]);

					let SQL = `INSERT INTO locations VALUES ($1,$2,$3,$4) RETURNING *;`;

					let safeValues = [
						city,
						locationData.formatted_query,
						locationData.latitude,
						locationData.longitude,
					];

					client
						.query(SQL, safeValues)
						.then((results) => {
							locationData;
							res.json(results.rows);
						})
						.catch((error) => {
							res.json(error.message);
						});
				});
			}
		})
		.catch((error) => {
			res.json(error.message);
		});
}

function weatherHandler(req, res) {
	let city = req.query.search_query;

	let key = process.env.WEATHER_API_KEY;
	let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city},NC&key=${key}`;

	superagent.get(url).then((data) => {
		const locData = data.body;
		const weatherData = locData.data.map((el) => {
			return new Weather(el);
		});
		res.status(200).json(weatherData);
	});
}

function parkHandler(req, res) {
	let city = req.query.search_query;

	let key = process.env.PARKS_API_KEY;
	let url = `https://developer.nps.gov/api/v1/parks?q=${city}&api_key=${key}`;

	superagent.get(url).then((data) => {
		const locData = data.body;

		const parkData = locData.data.map((el) => {
			return new Park(el);
		});
		res.status(200).json(parkData);
	});
}

function notFoundRouteHandler(req, res) {
	res.status(404).json('Page Not Found');
}

function errorHandler(error, req, res) {
	res.status(500).json(error);
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
	this.fee = data.entranceFees[0].cost || '0.00';
	this.description = data.description;
	this.url = data.url;
}

//routes
app.get('/', homeHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/parks', parkHandler);
app.get('*', notFoundRouteHandler);
app.use(errorHandler);

//app listening
const PORT = process.env.PORT_env || 3000;

client
	.connect()
	.then(() => {
		app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
	})
	.catch((error, req, res) => {
		res.send('Error', error.message);
	});
