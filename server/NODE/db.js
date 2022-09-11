const mysql = require('mysql');

let conn =  mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PSWD,
	database: process.env.DB_NAME
    });

module.exports = conn;

