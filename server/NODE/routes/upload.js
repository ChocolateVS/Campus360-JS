const express = require('express');
const router = express.Router();
const multer = require('multer')
    //Mongo
const { Level, Point } = require('../models/schema.js');


//---File Upload segment-----
router.post('/floorplan', (req, res, next) => {
    //Check if it has information
    try {
        let storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, req.query.local_directory ? req.query.local_directory : process.env.DEFAULT_IMAGE_DIR)
            },
            filename: function(req, file, cb) {
                cb(null, req.query.filename ? req.query.filename : file.originalname)
            }
        })
        let upload = multer({ storage: storage })
        return upload.single('file');
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }

}, async(req, res) => {
    console.log('processing file');
    if (!req.file) { res.status(400).json({ success: false, message: "Param name must be 'file'" }).end(); return; }
    let file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "Please upload a file!" }).end();
        return;
    }


    let fileInfo = {
        scale: (req.query.scale ? req.query.scale : process.env.DEFAULT_IMAGE_SCALE),
        name: (req.query.filename ? req.query.filename : file.originalname),
        directory: (req.query.local_directory ? req.query.local_directory : process.env.DEFAULT_IMAGE_DIR)
    }

    try {
        //Update Level from ID
        if (req.query.id) {
            let resp = await Level.find({ _id: req.query.id });
            if (!resp) throw 'Could not find specified levelID: " +  req.query.id + ". File uploaded regardless as ' + fileInfo.directory + "/" + fileInfo.name
            resp.image = fileInfo
            await resp.save();
        }
        res.status(201).json({
            success: true,
            message: "Successfully received image as: " + JSON.stringify(fileInfo)
        });
        res.end();
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
});

router.post('/panorama', (req, res, next) => {
    //Check if it has information
    try {
        let storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, req.query.local_directory ? req.query.local_directory : process.env.DEFAULT_IMAGE_DIR)
            },
            filename: function(req, file, cb) {
                cb(null, req.query.filename ? req.query.filename : file.originalname)
            }
        })
        let upload = multer({ storage: storage })
        return upload.single('file'); //check if will call next
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }

}, async(req, res) => {
    console.log('processing file');
    if (!req.file) { res.status(400).json({ success: false, message: "Param name must be 'file'" }).end(); return; }
    let file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "Please upload a file!" }).end();
        return;
    }


    let fileInfo = {
        north: (req.query.north ? req.query.north : process.env.DEFAULT_GYRO_CENTRE),
        name: (req.query.filename ? req.query.filename : file.originalname),
        directory: (req.query.local_directory ? req.query.local_dir : process.env.DEFAULT_IMAGE_DIR)
    }
    try {
        //Update Level from ID
        if (req.query.id) {
            let resp = await Point.find({ _id: req.query.id });
            if (!resp) throw 'Could not find specified pointID: " +  req.query.id + ". File uploaded regardless as ' + fileInfo.directory + "/" + fileInfo.name
            resp.image = fileInfo
            await resp.save();
        }
        res.json({
            success: true,
            message: "Successfully received image as: " + JSON.stringify(fileInfo)
        });
        res.end();
    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }


});

module.exports = router;