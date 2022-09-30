const express = require('express');
const { reset } = require('nodemon');
const router = express.Router();

const floor = require('./floor.js');


//Mongo
const Campus = require('../models/campus.js');
const { getCampus, getBlock, runQuery } = require('../shared.js');

let tableName = "Block";

router.use('/:blockId/floor',(req, res, next) => {res.blockId = req.params.blockId; next()}, floor);

router.get('/:blockId', getCampus, getBlock, async(req, res) => {
    res.status(200).json({ success: true, payload: res.block }).end();
});

router.get('/', getCampus, (req, res, next) =>{
    res.status(200).json({success:true, payload: res.campus.blocks})
});



router.post('/', getCampus, async (req, res, next)=>{
    if(res.campus)
    if(req.query.id){
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            
            res.campus.blocks.push({_id: req.query.id, name: req.query.name, moreAttr:moreAttr})
        }
    }else{
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            console.log(res.campus)
            res.campus.blocks.push({ name: req.query.name, moreAttr:moreAttr})
        }
    }
try{
    const saveResult = await res.campus.save();
    res.status(201).json({success:true, payload:saveResult})
}
catch(err){
    res.status(400).json({success:false, message: err.message})
} 
});

router.put('/:blockId', getCampus, getBlock, (req, res) => {
    res.status(200).json({ success: true, payload: res.block }).end();
});

router.delete('/:blockId', getCampus, getBlock, async (req, res) => {
    try{
        let deleteResponse = await res.campus.blocks.pull({_id:res.block._id});
        await res.campus.save();
        res.status(200).json({ success: true, payload: deleteResponse }).end();
        }
        catch (err){
            res.status(500).json({"success":false, message: err.message}).end()
        }
});




module.exports = router;