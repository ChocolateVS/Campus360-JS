const express = require('express');
const router = express.Router();

const areaAPI = require('./area.js');

//Mongo
const { Project, Room, Level, Area} = require('../models/schema.js');
const { getProject, recursiveDelProject } = require('../shared.js');
const { ObjectId } = require('mongoose').Types;


router.use('/:projectId/area', (req, res, next) => {
    res.projectId = req.params.projectId;
    next()
}, areaAPI)

//Utility funcs
router.get('/:projectId/rooms', getProject, async(req, res) => {
    let resp = await Room.find();
    res.status(200).json({ success: true, payload: resp });
})
//Utility funcs
router.get('/:projectId/roomlocation/:roomId', getProject, async(req, res) => {
    let area;
    let level;
    outObj = {};
    try {
        if (level = await Level.findOne({ 'room_ids': req.params.roomId })) {
            outObj.level = level
            if (area = await Area.findOne({ 'level_ids': level._id }))
                outObj.area = area;
            else throw 'No area attached to this level/point!'
        } else throw 'No level attached to this point!'
        console.log("Room location for " + req.params.roomId)
        res.status(200).json({ success: true, payload: outObj });
    } catch (ex) {
        res.status(400).json({ success: false, message: ex.message })
    }
});

//Utility funcs
router.get('/:projectId/pointlocation/:pointId', getProject, async(req, res) => {
    let area;
    let level;
    outObj = {};
    try {
        if (level = await Level.findOne({ 'point_ids': req.params.pointId })) {
            outObj.level = level
            if (area = await Area.findOne({ 'level_ids': level._id }))
                outObj.area = area;
            else throw 'No area attached to this level/point!'
        } else throw 'No level attached to this point!'
        console.log("Point location for " + req.params.pointId)
        res.status(200).json({ success: true, payload: outObj });
    } catch (ex) {
        res.status(400).json({ success: false, message: ex.message })
    }

})


router.get('/:projectId', getProject, (req, res) => {

    //Separates populated data into separate attribute - preserving IDs array
    let populatedObj = res.project.area_ids
    let projObj = res.project.toObject({ getters: true, minimize: false, depopulate:true})
    projObj.areas = populatedObj
    console.log("Get project:" + req.params.projectId)
    res.status(200).json({ success: true, payload: projObj })
});


router.get('/', async(req, res, next) => {
    let resp = await Project.find()
    res.status(200).json({ success: true, payload: resp })
});


router.post('/', async(req, res) => {
    let newProject;
    let createObj = {};
    
    try {
        if (req.query.id) createObj._id = ObjectId(req.query.id)
        //Areas have specific referencing, so can only be added via /level API
        if (req.query.name) createObj.name = req.query.name;
        if (req.query.description) createObj.description = req.query.description;
        newProject = new Project(createObj);
        if (newProject == null) throw 'Could not make Project object';
        const saveResult = await newProject.save();
        console.log("Create project:" + JSON.stringify(createObj))
        res.status(201).json({ success: true, payload: saveResult })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
});

router.patch('/:projectId', getProject, async(req, res) => {
    try {
        let updateObject = req.query;
        let id = ObjectId(req.params.projectId)
        let resp = await Project.updateOne({ _id: id }, { $set: updateObject });
        console.log("Update project:" + req.params.projectId)
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (ex) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.delete('/:projectId', getProject, async(req, res) => { //middleware is use by convention, not required for the functionality
    try {
        
        let deleteResponse = await recursiveDelProject([req.params.projectId])
        console.log("Delete project:" + req.params.projectId)
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});



module.exports = router;