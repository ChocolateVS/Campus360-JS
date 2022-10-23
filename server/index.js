require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const api = require('./routes/api.js');
const app = express();


const clientDir = path.join(__dirname, '../client', 'build')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.MONGO_URL || "mongodb://localhost:27017/waikato_db";

app.use(express.static(clientDir));
//API urls
app.use('/images', express.static(__dirname + '/images'));
app.use('/api', api);

//Serve client side
app.get('/', (req, res)=>{
    res.sendFile('index.html', {clientDir})
})


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection to database established...')

    let port = process.env.PORT ? process.env.PORT : 3001;
    app.listen(port, () => { console.log("Listening on " + port) });

}).catch(err => {
    console.log(err);
});