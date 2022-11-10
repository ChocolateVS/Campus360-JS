const express = require('express');
require('dotenv').config()
const router = express.Router();
const mongoose = require('mongoose')

const { Room, Area, Level } = require('../models/schema.js');
//Routes
const project = require('./project.js');
const uploadAPI = require('./upload.js')


//Mongoose
const { Project } = require('../models/schema.js')

router.use((req, res, next)=>{
    if(req.method == "GET") next();
    else if(req.body.auth && req.body.auth == process.env.AUTH_KEY) next();
    else 
    res.status(400).json({success:false, payload: "User does not have auth!"})
})

router.get('/rooms', async(req, res) => {
    let resp = await Room.find();
    res.status(200).json({ success: true, payload: resp });
})

router.get('/roomlocation/:roomId', async(req, res) => {
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


router.get('/pointlocation/:pointId', async(req, res) => {
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

router.use('/project', project);

router.use('/upload', uploadAPI)

router.get('/objectid', (req, res) => {
    res.status(200).json({ success: true, payload: mongoose.Types.ObjectId() }).end();
})

router.get('/all', async(req, res) => {
    let resp = await Project.find().populate({
        path: 'area_ids',
        populate: {
            path: 'level_ids',
            populate: [{
                    path: 'room_ids',
                    populate: { path: 'link_ids' }
                },
                {
                    path: 'point_ids',
                    populate: {
                        path: 'link_ids'
                    }
                }
            ]
        }
    })
    console.log("Get all")
    res.status(200).json({ success: true, payload: resp }).end();
})


module.exports = router;