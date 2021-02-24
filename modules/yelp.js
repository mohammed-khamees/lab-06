'use strict';

require('dotenv').config();
const superagent = require('superagent');

//handlers
function yelpHandler(req, res) {
	let lat = req.query.latitude;
	let lon = req.query.longitude;

	let key = process.env.YELP_API_KEY;

	let page = req.query.page;
	let numPerPage = 5;
	let start = (page - 1) * numPerPage + 1;

	let url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}&limit=${numPerPage}&offset=${start}`;

	superagent
		.get(url)
		.set('Authorization', `Bearer ${key}`)
		.then((data) => {
			const locData = data.body.businesses;
			const yelpData = locData.map((el) => {
				return new Yelp(el);
			});
			res.status(200).json(yelpData);
		})
		.catch((error) => {
			res.status(500).json(error);
		});
}

//constructors functions
function Yelp(data) {
	this.name = data.name;
	this.image_url = data.image_url;
	this.price = data.price;
	this.rating = data.rating;
	this.url = data.url;
}

module.exports = yelpHandler;
