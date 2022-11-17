const express = require('express');
const router = express.Router();
const linkAPI = require('./link.js')
    //Mongo
const { Room } = require('../models/schema.js');
const { getProject, getArea, getLevel, getRoom, recursiveDelRoom } = require('../shared.js');
const { ObjectId } = require('mongoose').Types


router.use('/:roomId/link', (req, res, next) => {
    res.roomId = req.params.roomId;
    next();
}, linkAPI);


router.get('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => {
    let links = res.room.link_ids
    let projObj = res.room.toObject({ getters: true, minimize: false, depopulate:true})
    projObj.links = links
    console.log('Get room: ' + req.params.roomId)
    res.status(200).json({ success: true, payload: projObj }).end();
});

router.get('/', getProject, getArea, getLevel, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.level.room_ids })
});



router.post('/', getProject, getArea, getLevel, async(req, res) => {
    let newRoom;
    let createObj = {};
    
    try {
        if (req.query.id) createObj._id = ObjectId(req.query.id)
        if (req.query.owner) createObj.owner = req.query.owner
        if(req.query.type) createObj.type = req.query.type;
            //Points & Rooms have specific validation required, so need to ensure they are added only via the /point or /room API
        if (req.query.name) createObj.name = req.query.name;
        if (req.query.description) createObj.description = req.query.description;
        if (res.level && res.area && res.project) {
            createObj.project = res.project._id;
            createObj.level = res.level._id;
            createObj.area = res.area._id;
            newRoom = new Room(createObj);
            res.level.room_ids.push(newRoom._id)
    }
        //Save changes to DB
        if (newRoom == null) throw 'Could not create Room object';
        const saveResult = await newRoom.save();
        await res.level.save();
        console.log('Create room: ' + JSON.stringify(createObj))
        res.status(201).json({ success: true, payload: saveResult })
    } catch (err) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.patch('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => {
    try {
        let resp = await Room.updateOne({ _id: res.room._id }, { $set: req.query }); //Only updates the attributes specified in 'query'
        console.log('Update room: ' + req.params.roomId)
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (err) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.delete('/:roomId', getProject, getArea, getLevel, getRoom, async(req, res) => { //middleware is use by convention, not required for the functionality
    try {
        let deleteResponse = await recursiveDelRoom([req.params.roomId])
        console.log('Delete room: ' + req.params.roomId)
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});

module.exports = router;