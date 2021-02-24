'use strict';

require('dotenv').config();
const superagent = require('superagent');

//handlers
function movieHandler(req, res) {
	let key = process.env.MOVIE_API_KEY;

	const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}`;

	superagent.get(url).then((data) => {
		const locData = data.body;
		const movieData = locData.results.map((el) => {
			return new Movie(el);
		});
		res.status(200).json(movieData);
	});
}

//constructors functions
function Movie(data) {
	this.title = data.original_title;
	this.overview = data.overview;
	this.average_votes = data.vote_average;
	this.total_votes = data.vote_count;
	this.image_url = `https://image.tmdb.org/t/p/w500/${data.backdrop_path}`;
	this.popularity = data.popularity;
	this.released_on = data.release_date;
}

module.exports = movieHandler;
