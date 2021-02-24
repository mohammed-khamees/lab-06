'use strict';

require('dotenv').config();
const superagent = require('superagent');

//handlers
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

//constructors functions
function Park(data) {
	this.name = data.fullName;
	this.address = data.addresses.map((address) => {
		return `${address.line1}. ${address.city} ${address.stateCode} ${address.postalCode}`;
	})[0];
	this.fee = data.entranceFees[0].cost || '0.00';
	this.description = data.description;
	this.url = data.url;
}

module.exports = parkHandler;
