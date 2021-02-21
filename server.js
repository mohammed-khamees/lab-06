'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const locationData = require('./data/location.json');
const weatherData = require('./data/weather.json');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
	res.send('Home Page');
});

app.get('/location', (req, res) => {
	const place = new Location(locationData);
	res.json(place);
});

app.get('/weather', (req, res) => {
	let weather = [];
	weatherData.data.forEach((el) => {
		const place = new Weather(el);
		weather.push(place);
	});

	res.json(weather);
});

function Location(data) {
	this.search_query = 'Lynnwood';
	this.display_name = data[0].display_name;
	this.lat = data[0].lat;
	this.lon = data[0].lon;
}

function Weather(data) {
	this.forecast = data.weather.description;
	this.time = data.datetime;
}

app.use('*', (req, res) => {
	res.status(500).json({
		status: 500,
		errorMessage: 'Sorry, something went wrong',
	});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
