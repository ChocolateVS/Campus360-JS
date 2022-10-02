const express = require('express');
const multer = require('multer');
require('dotenv').config()
const router = express.Router();

//Routes
const project = require('./project.js');


//NOTE: POST/UPDATE/GET/DELETE WILL IGNORE INCORRECT QUERY VALUES - i.e. ?nonexistant=test will be accepted, but nothing will be done with it. 

//Mongoose
const { Project } = require('../models/schema.js')


//API
router.use('/project', project);

//----File upload---
//Set Multer storage
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './images/')
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname)
    }
});
var upload = multer({ storage: storage });


//---File Upload segment-----
router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req);
    if (!req.file) { res.end({ success: false, message: "Param name must be 'file'" }); return; }
    let file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "Please upload a file!" });
        res.end();
        return;
    }
    res.json({ success: true, message: "Successfully received image as ./images/" + file.originalname });
    res.end();
});

router.get('/mongo', async(req, res) => {
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