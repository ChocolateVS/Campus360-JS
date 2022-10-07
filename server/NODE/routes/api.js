const express = require('express');
require('dotenv').config()
const router = express.Router();
const mongoose = require('mongoose')

//Routes
const project = require('./project.js');
const uploadAPI = require('./upload.js')


//Mongoose
const { Project } = require('../models/schema.js')

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

    res.status(200).json({ success: true, payload: resp }).end();
})


module.exports = router;