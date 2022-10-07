const express = require('express');
const router = express.Router();
const linkAPI = require('./link.js')
    //Mongo
const { ObjectId } = require('mongoose').Types
const { Point } = require('../models/schema.js');
const { getProject, getArea, getLevel, getPoint, recursiveDelPoint } = require('../shared.js');

let tableName = "Point";

router.use('/:pointId/link', (req, res, next) => {
    res.pointId = req.params.pointId;
    next()
}, linkAPI);


router.get('/:pointId', getProject, getArea, getLevel, getPoint, async(req, res) => {
    let links = res.point.link_ids
    let projObj = res.point.toObject({ getters: true, minimize: false, depopulate:true})
    projObj.links = links
    res.status(200).json({ success: true, payload: projObj }).end();
});

router.get('/', getProject, getArea, getLevel, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.level.points })
});

router.post('/', getProject, getArea, getLevel, async(req, res) => {
    console.log(req.params)
    let newPoint;
    let createObj = {};
    if (req.query.id) createObj._id = ObjectId(req.query.id)
        //Levels have specific referencing, so can only be added via /level API
    if (req.query.x) createObj.x = req.query.x;
    if (req.query.y) createObj.y = req.query.y;
    if (req.query.filename) createObj.image.filename = req.query.filename;
    if (req.query.local_directory) createObj.image.directory = req.query.local_directory;
    if (req.query.north) createObj.image.north = req.query.north;
    if (req.query.name) createObj.name = req.query.name;
    if (res.level) {
        newPoint = new Point(createObj);
        res.level.point_ids.push(newPoint._id)
    }
    try {
        //Save changes to DB
        if (newPoint == null) throw 'Could not create Point object';
        const saveResult = await newPoint.save();
        await res.level.save();
        res.status(201).json({ success: true, payload: saveResult })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
});

router.patch('/:pointId', getProject, getArea, getLevel, getPoint, async(req, res) => {
    try {
        let resp = await res.point.updateOne({ _id: ObjectId(req.params.pointId) }, { $set: req.query }); //Only updates the attributes specified in 'query'
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (ex) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.delete('/:pointId', getProject, getArea, getLevel, getPoint, async(req, res) => { //middleware is use by convention, not required for the functionality
    try {
        //remove references
        let deleteResponse = await recursiveDelPoint([res.params.pointId])
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});



module.exports = router;