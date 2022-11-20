const express = require('express');
require('dotenv').config()
const router = express.Router();
const mongoose = require('mongoose')

//Routes
const project = require('./project.js');
const uploadAPI = require('./upload.js')


//Mongoose
const { Project } = require('../models/schema.js')

router.use((req, res, next)=>{
    if(req.method == "GET") next();
    else if('auth' in req.body && req.body.auth == process.env.AUTH_KEY) next();
    else {
        console.log("Debugging failed Auth")
        console.log(req.body)
        console.log(req.params)
        console.log(req.query)
        res.status(400).json({success:false, payload: "User does not have auth!"})
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