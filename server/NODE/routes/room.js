const express = require('express');
const util = require('util');
const router = express.Router();

//Mongo
const {Level} = require('../models/schema.js');
const { getProject, getArea, getLevel, getRoom } = require('../shared.js');
const {ObjectId} = require('mongoose').Types

let tableName = "Room";

router.get('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => {
        res.status(200).json({success:true, payload: res.room[0].room })
});

router.get('/', getProject, getArea, getLevel, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.level.rooms})
});



router.post('/', getLevel, async(req, res) => {
    let createObj = {};
    if(req.query.id) createObj._id = ObjectId(req.query.id)
    if(req.query.owner) createObj.owner = req.query.owner
    //Points & Rooms have specific validation required, so need to ensure they are added only via the /point or /room API
    if(req.query.name) createObj.name = req.query.name;
    try{
        if(!res.level) throw 'Level parent could not be found, could not add'
        else {
            res.level.rooms.push(createObj)
        }
        let result = await res.level.save()
        res.status(200).json({ success: true, payload: result.rooms})
    }
    catch(err){
        res.status(400).json({"success":false, message: err.message}).end()
    }
    
});

router.patch('/:roomId', getProject, getArea, getLevel, getRoom, async (req, res) => {
    try{
        throw 'DEVELOPMENT ISSUES - Unable to update items as this time!'
        let id = ObjectId(req.params.roomId)
        let updateObject = await Level.aggregate([
            {$unwind: '$rooms'},
            {$match: { _id: res.level._id, 'rooms._id':id}}
            ]);
        for(let key in req.query){
            console.log(updateObject[0].rooms);
            updateObject[0].rooms[key] = req.query[key];
        }
        //let resp = await updateObject.update({_id:res.level._id}, {$set: {rooms: });
        res.status(200).json({ success: true, payload: resp }).end();
        }
        catch(err){
            res.status(400).json({"success":false, message: err.message}).end()
        }
});

router.delete('/:roomId', getProject, getArea, getLevel, getRoom, async (req, res) => {
    try{
        let deleteResponse = await Level.updateOne({_id:res.level._id},{$pull:{rooms: res.room._id }});
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    }
    catch (err){
        res.status(500).json({"success":false, message: err.message}).end()
    }
});



module.exports = router;