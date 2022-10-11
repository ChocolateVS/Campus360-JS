require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const api = require('./routes/api.js');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.MONGO_URL || "mongodb://localhost:27017/waikato_db";

//API urls
app.use('/images', express.static(__dirname + '/images'));
app.use('/api', api);
app.use('/', express.static(__dirname + '/Campus360-JS'));


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to database established...')

    let port = process.env.PORT ? process.env.PORT : 3000;
    app.listen(port, () => { console.log("Listening on " + port) });

}).catch(err => {
    console.log(err);
});