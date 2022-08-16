  GNU nano 4.8                                          index.js
const express = require('express'); 
const mysql = require('mysql');
require('dotenv').config();  
const bodyParser = require('body-parser');      
const app = express();                   
//app.use(bodyParser.urlencoded({extended:false}));     
//app.use(bodyParser.json());              
app.use(express.json());
app.post('/', (request, response) => {    
  console.log(request.headers);  
  console.log(request.body);   
  response.end("Received message " + request);  
});                

app.listen(3000, ()=>{console.log("Listening on 3000")});    
