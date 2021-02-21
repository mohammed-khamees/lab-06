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

// app.get('/', (req, res) => {});

app.use('*', (req, res) => {
	res.send('Page not Found');
});

function Location(data) {
	this.search_query = 'Lynnwood';
	this.display_name = data[0].display_name;
	this.lat = data[0].lat;
	this.lon = data[0].lon;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
