const express = require('express');
const router = express.Router();

const areaAPI = require('./area.js');


//Mongo
const { Project } = require('../models/schema.js');
const { getProject } = require('../shared.js');
const { ObjectId } = require('mongoose').Types;

router.use('/:projectId/area', (req, res, next) => {
    res.projectId = req.params.projectId;
    next()
}, areaAPI)

router.get('/:projectId', getProject, (req, res) => {
    res.status(200).json({ success: true, payload: res.project })
});


router.get('/', async(req, res, next) => {
    let mongoResponse = await Project.find();
    res.status(200).json({ success: true, payload: mongoResponse })
});


router.post('/', async(req, res) => {
    let newProject;
    let createObj = {};
    if (req.query.id) createObj._id = ObjectId(req.query.id)
        //Areas have specific referencing, so can only be added via /level API
    if (req.query.name) createObj.name = req.query.name;
    newProject = new Project(createObj);
    try {
        if (newProject == null) throw 'Could not make Project object';
        const saveResult = await newProject.save();
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
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (ex) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }
});

router.delete('/:projectId', getProject, async(req, res) => {
    try {
        let deleteResponse = await res.project.deleteOne()
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});



module.exports = router;