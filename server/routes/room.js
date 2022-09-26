const express = require('express');
const util = require('util');
const router = express.Router();

//Mongo
const { Project, Level} = require('../models/schema.js');
const { getProject, getArea, getLevel, getRoom } = require('../shared.js');
const {ObjectId} = require('mongoose').Types

let tableName = "Room";

router.get('/:roomId', getProject, getArea, getLevel, getRoom, (req, res) => {
    res.status(200).json({ success: true, payload: res.room })
});

router.get('/', getProject, getArea, getLevel, async (req, res, next) => {
    console.log(req.params)
    let createObj = {};
    if(req.query.id) createObj._id = ObjectId(req.query.id)
    if(req.query.owner) createObj.owner = req.query.owner
    //Levels have specific referencing, so can only be added via /level API
    if(req.query.name && res.level){
        createObj.name = req.query.name;
        res.level.areas.push(createObj)
    }
try{
    if(createObj == null) throw 'Could not create Room object';
    const saveResult = await res.level.save();
    res.status(201).json({success:true, payload:saveResult})
}
catch(err){
    res.status(400).json({success:false, message: err.message})
} 
});



router.post('/', async(req, res) => {
    let newRoom;
    let createObj = {};
    if(req.query.id) createObj._id = ObjectId(req.query.id)
    if(req.query.owner) createObj.owner = req.query.owner
    //Points & Rooms have specific validation required, so need to ensure they are added only via the /point or /room API
    if(req.query.name) createObj.name = req.query.name;
    if(res.level){
        res.level.rooms.push(createObj._id)
    }
    res.status(200).json({ success: true, payload: res.room })
});

router.patch('/:roomId', getProject, getArea, getLevel, getRoom, async (req, res) => {
    try{
        let id = ObjectId(req.params.roomId)
        let updateObject = await Level.aggregate([
            {$unwind: '$rooms'},
            {$match: { _id:res.level._id, 'rooms._id':id}}
            ]);
            console.log(updateObject);
        for(let key in req.query){
            updateObject.rooms[0][key] = req.query[key];
        }
        let resp = await updateObject.save();
        res.status(200).json({ success: true, payload: resp }).end();
        }
        catch(ex){
            res.status(400).json({"success":false, message: err.message}).end()
        }
});

router.delete('/:roomId', getProject, getArea, getLevel, getRoom, async (req, res) => {
    try{
        let deleteResponse = await Level.pull({rooms: res.room._id });
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    }
    catch (err){
        res.status(500).json({"success":false, message: err.message}).end()
    }
});



module.exports = router;