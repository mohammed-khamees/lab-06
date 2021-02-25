'use strict';

require('dotenv').config();
const superagent = require('superagent');

//connect to database
const client = require('./../database');

// handlers
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

//constructors functions
function Location(city, data) {
	this.search_query = city;
	this.formatted_query = data.display_name;
	this.latitude = data.lat;
	this.longitude = data.lon;
}

module.exports = locationHandler;
