const express = require('express');
const multer = require('multer');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const api = require('./api.js');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/images', express.static(__dirname + '/images'));
app.use('/api', api);
app.use('/', express.static(__dirname + '/Campus360-JS'));

let port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, ()=>{console.log("Listening on " + port)});
