const express = require('express');
const util = require('util');
const router = express.Router();

//Mongo
const Campus = require('../models/campus.js');
const { getCampus, getBlock, getFloor, getRoom } = require('../shared.js');

let tableName = "Room";

router.get('/:id', getCampus, getBlock, getFloor, getRoom, (req, res) => {
    res.status(200).json({ success: true, payload: res.room })
});

router.get('/', getCampus, getBlock, getFloor, async (req, res, next) => {
    console.log(req.params)
    if(res.floor)
    if(req.query.id){
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            
            res.floor.rooms.push({_id: req.query.id, name: req.query.name, moreAttr:moreAttr})
        }
    }else{
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            console.log(res.campus)
            res.floor.rooms.push({ name: req.query.name, moreAttr:moreAttr})
        }
    }
try{
    const saveResult = await res.floor.save();
    res.status(201).json({success:true, payload:saveResult})
}
catch(err){
    res.status(400).json({success:false, message: err.message})
} 
});



router.post('/', async(req, res) => {
    res.status(200).json({ success: true, payload: res.room })
});

router.put('/:id', getCampus, getBlock, getFloor, getRoom, (req, res) => {
    res.status(200).json({ success: true, payload: res.room })
});

router.delete('/:id', getCampus, getBlock, getFloor, getRoom, async (req, res) => {
    try{
        let deleteResponse = await res.floor.rooms.pull({_id:res.room._id}).save();
        res.status(200).json({ success: true, payload: deleteResponse }).end();
        }
        catch (err){
            res.status(500).json({"success":false, message: err.message}).end()
        }
});



module.exports = router;