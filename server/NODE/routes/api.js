const express = require('express');
const multer = require('multer');
require('dotenv').config()
const router = express.Router();
const mongoose = require('mongoose')

//Routes
const project = require('./project.js');

//NOTE: POST/UPDATE/GET/DELETE WILL IGNORE INCORRECT QUERY VALUES - i.e. ?nonexistant=test will be accepted, but nothing will be done with it. 

//Mongoose
const { Project, Level } = require('../models/schema.js')


//API
router.use('/project', project);

let storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, process.env.DEFAULT_IMAGE_DIR)
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    })
    //----File upload---
let upload = multer({ storage: storage });


//---File Upload segment-----
router.post('/upload', (req, res, next) => {
    //Check if it has information
    try {
        if (req.query.level) {
            let storage = multer.diskStorage({
                destination: function(req, file, cb) {
                    cb(null, req.query.local_directory ? req.query.local_directory : process.env.DEFAULT_IMAGE_DIR)
                },
                filename: function(req, file, cb) {
                    cb(null, req.query.name ? req.query.name : file.originalname)
                }
            })
            let upload = multer({ storage: storage })
            return upload.single('file');
        } else
            return upload.single('file') //check if need to call next???? - call with default ./image & original filename
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }

}, async(req, res) => {
    console.log(req);
    if (!req.file) { res.end({ success: false, message: "Param name must be 'file'" }); return; }
    let file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "Please upload a file!" });
        res.end();
        return;
    }

    let fileInfo = {
        scale: (req.query.scale ? req.query.scale : process.env.DEFAULT_IMAGE_SCALE),
        name: (req.query.name ? req.query.name : file.originalname),
        directory: (req.query.local_directory ? req.query.local_dir : process.env.DEFAULT_IMAGE_DIR)
    }

    try {
        //Update Level from ID
        if (req.query.level) {
            let level = await Level.find({ _id: req.query.level });
            if (level) throw 'Could not find specified levelID: " +  req.query.level + ". File uploaded regardless as ' + fileInfo.directory + "/" + fileInfo.name
            level.image = fileInfo
            await level.save();
        }
        res.json({
            success: true,
            message: "Successfully received image as: " + fileInfo.directory + "/" + fileInfo.name
        });
        res.end();
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }


});

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