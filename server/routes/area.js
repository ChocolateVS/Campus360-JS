/**
 * Handles Area API - CRUD of area object
 * 
 */


const express = require('express');
const router = express.Router();

const levelAPI = require('./level.js');

const { ObjectId } = require('mongoose').Types

//Mongo
const { Area } = require('../models/schema.js');
const { getProject, getArea, recursiveDelArea } = require('../shared.js');

let tableName = "Block";

router.use('/:areaId/level', (req, res, next) => {
    res.areaId = req.params.areaId;
    next()
}, levelAPI);

router.get('/:areaId', getProject, getArea, async(req, res) => {
    let levels = res.area.level_ids
    let projObj = res.area.toObject({ getters: true, minimize: false, depopulate:true})
    projObj.levels = levels
    console.log("Get area:" + res.params.areaId)
    res.status(200).json({ success: true, payload: projObj }).end();
});

router.get('/', getProject, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.project.area_ids })
});



router.post('/', getProject, async(req, res, next) => {
    let newArea;
    let createObj = {};
    
    try {
        if (req.query.id) createObj._id = ObjectId(req.query.id)
        //Levels have specific referencing, so can only be added via /level API
        if (req.query.name) createObj.name = req.query.name;
        if (res.project) {
            newArea = new Area(createObj);
            res.project.area_ids.push(newArea._id)
        }

        if (newArea == null) throw "Could not create an 'Area' instance";
        const saveResult = await newArea.save();
        await res.project.save(); //Must save after incase newArea is invalid
        console.log("Create area:" + JSON.stringify(createObj))
        res.status(201).json({ success: true, payload: saveResult })
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
});

router.patch('/:areaId', getProject, getArea, async(req, res) => {
    try {
        let updateObject = req.query;
        let id = ObjectId(req.params.areaId)
        let resp = await Area.updateOne({ _id: id }, { $set: updateObject });
        console.log("Update area:" + res.params.areaId)
        res.status(200).json({ success: true, payload: resp }).end();
    } catch (ex) {
        res.status(400).json({ "success": false, message: ex.message }).end()
    }
});

router.delete('/:areaId', getProject, getArea, async(req, res) => { //middleware is use by convention, not required for the functionality
    try {
        //Remove references
        let deleteResponse = await recursiveDelArea([req.params.areaId])
        console.log("Delete area:" + res.params.areaId)
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end();
    }
});




module.exports = router;