const express = require('express');
const multer = require('multer');
require('dotenv').config()
const router = express.Router();
const mongoose = require('mongoose')

//Routes
const project = require('./project.js');
const uploadAPI = require('./upload.js')

//NOTE: POST/UPDATE/GET/DELETE WILL IGNORE INCORRECT QUERY VALUES - i.e. ?nonexistant=test will be accepted, but nothing will be done with it. 

//Mongoose
const { Project, Level } = require('../models/schema.js')


//API
router.use('/project', project);

router.use('/upload', uploadAPI)

router.get('/objectid', (req, res) => {
    res.status(200).json({ success: true, payload: mongoose.Types.ObjectId() }).end();
})

router.get('/all', async(req, res) => {
    let resp = await Project.find().populate({
        path: 'areas',
        populate: {
            path: 'levels',
            populate: [{
                    path: 'rooms',
                    populate: { path: 'links' }
                },
                {
                    path: 'points',
                    populate: {
                        path: 'links'
                    }
                }
            ]
        }
    })
    res.status(200).json({ success: true, payload: resp }).end();
})






module.exports = router;