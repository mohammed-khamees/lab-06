require('dotenv').config();
const pg = require('pg');

// const client = new pg.Client({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: process.env.DATABASE_URL ? true : false,
// });
const client = new pg.Client(process.env.DATABASE_URL);

module.exports = client;
