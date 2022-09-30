const express = require('express');
const util = require('util');
const router = express.Router();

//Mongo
const { Level } = require('../models/schema.js');
const { getProject, getArea, getLevel, getRoom } = require('../shared.js');
const { ObjectId } = require('mongoose').Types

let tableName = "Room";

router.get('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => {
    res.status(200).json({ success: true, payload: res.room })
});

router.get('/', getProject, getArea, getLevel, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.level.rooms })
});



router.post('/', getLevel, async(req, res) => {
    let newRoom;
    let createObj = {};
    if (req.query.id) createObj._id = ObjectId(req.query.id)
    if (req.query.owner) createObj.owner = req.query.owner
        //Points & Rooms have specific validation required, so need to ensure they are added only via the /point or /room API
    if (req.query.name) createObj.name = req.query.name;
    if (res.level) {
        newRoom = new Room(createObj);
        res.level.rooms.push(newRoom._id)
    }
    try {
        //Save changes to DB
        if (newRoom == null) throw 'Could not create Room object';
        const saveResult = await newRoom.save();
        await res.level.save();
        res.status(201).json({ success: true, payload: saveResult })
        let result = await res.room.save()
        res.status(200).json({ success: true, payload: result.rooms })
    } catch (err) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }

});

router.patch('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => {
    try {
        let resp = await res.room.updateOne({ _id: ObjectId(req.params.roomId) }, { $set: req.query }); //Only updates the attributes specified in 'query'
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (ex) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.delete('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => {
    try {
        await Level.updateMany({ rooms: res.room._id }, { $pull: { rooms: res.room._id } });
        let deleteResponse = await res.room.deleteOne();
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});

module.exports = router;