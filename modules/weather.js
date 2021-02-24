'use strict';

require('dotenv').config();
const superagent = require('superagent');

//handlers
function weatherHandler(req, res) {
	let city = req.query.search_query;

	let key = process.env.WEATHER_API_KEY;

	const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city},NC&key=${key}`;

	superagent.get(url).then((data) => {
		const locData = data.body;
		const weatherData = locData.data.map((el) => {
			return new Weather(el);
		});
		res.status(200).json(weatherData);
	});
}

//constructors functions
function Weather(data) {
	this.forecast = data.weather.description;
	this.time = data.datetime;
}


module.exports = weatherHandler;

