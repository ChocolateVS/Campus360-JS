const express = require('express'); 
const mysql = require('mysql');
require('dotenv').config();  
const util = require('util');
const conn = mysql.createConnection({
  host: "localhost",
  user: process.env.sqluser,
  password: process.env.sqlpass,
  database: "waikato_db"
});

const app = express();                   
              
app.use(express.json());
app.get('/', (request, response) => {    
  console.log(request.headers);  
  console.log(request.query);   
 try{
   let item = await query(request.query.query);//Forwards WITHOUT checking for injection - yes, we know.
   console.log(item);
   response.end(JSON.stringify(item));
   return;
 }
  catch(err){
   response.end(JSON.stringify(err));
    return;
  }
  response.end("Somehow the try/catch got skipped?");
});                

coon.connect((err)=>{
 if (err) throw err;
  console.log("Connected!");
});

app.listen(3000, ()=>{console.log("Listening on port 3000")});    
