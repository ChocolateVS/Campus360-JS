const express = require('express');
const util = require('util');
const router = express.Router();

//Mongo
const Campus = require('../models/campus.js');
const { getCampus, getBlock, getFloor, getPoint } = require('../shared.js');

let tableName = "Point";

router.get('/:id', getCampus, getBlock, getFloor, getPoint, async(req, res) => {
    res.status(200).json({ success: true, payload: res.point })
});

router.get('/', getCampus, getBlock, getFloor, (req, res, next) => {
    res.status(200).json({success:true, payload: res.floor.points})
});



router.post('/', getCampus, getBlock, getFloor, async (req, res) => {
    console.log(req.params)
    if(res.floor)
    if(req.query.id){
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            
            res.floor.points.push({_id: req.query.id, name: req.query.name, moreAttr:moreAttr})
        }
    }else{
        if(req.query.name){
            let moreAttr = {}
            for(var prop in req.body){
                moreAttr[prop] = req.body[prop]
            }
            console.log(res.campus)
            res.floor.points.push({ name: req.query.name, moreAttr:moreAttr})
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

router.put('/:id', getCampus, getBlock, getFloor, getPoint, (req, res) => {
    res.status(200).json({ success: true, payload: res.point })
});

router.delete('/:id', getCampus, getBlock, getFloor, getPoint, async(req, res) => {
    try{
        let deleteResponse = await res.floor.points.pull({_id:res.point._id}).save();
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    }
    catch (err){
        res.status(500).json({"success":false, message: err.message}).end()
    }
});



module.exports = router;