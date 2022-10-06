const express = require('express');
const router = express.Router();

const roomAPI = require('./room.js');
const pointAPI = require('./point.js');

//Mongoose Schema & shared func
const { Level } = require('../models/schema.js');
const { getProject, getArea, getLevel, recursiveDelLevel } = require('../shared.js');
const { ObjectId } = require('mongoose').Types

//Pass router on if room/point level
router.use('/:levelId/room', (req, res, next) => {
    res.levelId = req.params.levelId;
    next()
}, roomAPI);
router.use('/:levelId/point', (req, res, next) => {
    res.levelId = req.params.levelId;
    next()
}, pointAPI);

router.get('/:levelId', getProject, getArea, getLevel, async(req, res) => {
    res.status(200).json({ success: true, payload: res.level }).end();
});

router.get('/', getProject, getArea, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.area.levels })
});

router.post('/', getProject, getArea, async(req, res) => {
    let newLevel;
    let createObj = {};

    if (req.query.id) createObj._id = ObjectId(req.query.id)
    if (req.query.local_directory) createObj.image.directory = req.query.local_directory;
    if (req.query.filename) createObj.image.name = req.query.filename;
    if (req.query.scale) createObj.image.scale = req.query.scale;
    if (req.query.name) createObj.name = req.query.name;
    //Points & Rooms have specific validation required, so need to ensure they are added only via the /point or /room API
    if (res.area) {
        newLevel = new Level(createObj);
        res.area.levels.push(newLevel._id)
    }

    try {
        if (newLevel == null) throw 'Could not make Level object';
        const saveResult = await newLevel.save()
        await res.area.save(); //Must save AFTER incase the 'newLevel' is invalid

        res.status(201).json({ success: true, payload: saveResult })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
});

router.patch('/:levelId', getProject, getArea, getLevel, async(req, res) => {
    try {
        let resp = await Level.updateOne({ _id: ObjectId(req.params.levelId) }, { $set: req.query }); //Only update specified values in 'query'
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (ex) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.delete('/:levelId', getProject, getArea, getLevel, async(req, res) => { //middleware is use by convention, not required for the functionality
    try {
        //Remove references
        let deleteResponse = await recursiveDelLevel([res.params.levelId])
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});



module.exports = router;