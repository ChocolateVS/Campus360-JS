const express = require('express');
const util = require('util');
const router = express.Router();
const conn = require('./db.js');
const query = util.promisify(conn.query).bind(conn);

let tableName = "Floor";

router.get('/:id', async (req, res)=>{
    await query("SELECT * FROM `"+tableName+"` WHERE `id`='" + req.params.id + "';")
        .then((val)=>
            {
                res.json({success:true, payload:val});
                res.end();
            })
        .catch((err)=>
            {
                res.json({success:false, message: err});
                res.end();
            }); //Yes I am aware of SQL Injections - this is just a small scale system
});

router.get('/', async (req, res)=>{
    await query("SELECT * FROM `"+tableName+"`;")
        .then((val)=>
            {
                res.json({success:true, payload:val});
                res.end();
            })
        .catch((err)=>
            {
                res.json({success:false, message: err});
                res.end();
            }); 
});



router.post('/', (req, res)=>{
    console.log(req);  
res.json({success:false, message:"Function not implemented"});
        res.end();

});

router.put('/', (req, res)=>{
    console.log(req);
res.json({success:false, message:"Function not implemented"});
        res.end();

});

router.delete('/', (req,res)=>{
    console.log(req);
res.json({success:false, message:"Function not implemented"});
        res.end();

});



module.exports = router;

