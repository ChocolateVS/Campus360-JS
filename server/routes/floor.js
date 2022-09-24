const express = require('express');
const util = require('util');
const router = express.Router();

const room = require('./room.js');
const point = require('./point.js');

//Mongo
const Campus = require('../models/campus.js');
const { getCampus, getBlock, getFloor} = require('../shared.js');

let tableName = "Floor";

router.use('/:floorId/room', (req, res, next) => {res.floorId = req.params.floorId; next()}, room);
router.use('/:floorId/point', (req, res, next) => {res.floorId = req.params.floorId; next()}, point);

router.get('/:floorId', getCampus, getBlock, getFloor, async(req, res) => {
    res.status(200).json({ success: true, payload: res.floor }).end();
});

router.get('/', getCampus, getBlock, (req, res, next) => {
    res.status(200).json({success:true, payload: res.block.floors })
});



router.post('/', getCampus, getBlock, async(req, res) => {
    console.log(req.params)
    if(res.block)
    if(req.query.id){
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            
            res.block.floors.push({_id: req.query.id, name: req.query.name, moreAttr:moreAttr})
        }
    }else{
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            console.log(res.campus)
            res.block.floors.push({ name: req.query.name, moreAttr:moreAttr})
        }
    }
try{
    const saveResult = await res.block.save();
    res.status(201).json({success:true, payload:saveResult})
}
catch(err){
    res.status(400).json({success:false, message: err.message})
} 
});

router.put('/:floorId', getCampus, getBlock, getFloor, async(req, res) => {
    res.status(200).json({ success: true, payload: res.floor }).end();
});

router.delete('/:floorId', getCampus, getBlock, getFloor, async(req, res) => {
    try{
        let deleteResponse = await res.block.floors.pull({_id:res.block._id}).save();
        res.status(200).json({ success: true, payload: deleteResponse }).end();
        }
        catch (err){
            res.status(500).json({"success":false, message: err.message}).end()
        }
});



module.exports = router;