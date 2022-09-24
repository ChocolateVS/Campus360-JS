const express = require('express');
const router = express.Router();

const block = require('./block.js');


//Mongo
const Campus = require('../models/campus.js');
const { getCampus } = require('../shared.js');
let tableName = "Campus";

router.use('/:campusId/block', (req, res, next) => {res.campusId = req.params.campusId; next()}, block)

router.get('/:campusId', getCampus, (req, res) => {
    res.status(200).json({ success: true, payload: res.campus })
});


router.get('/', (req, res, next) => { req.params.campusId = {$exists:true}; next();}, getCampus,
(req, res, next) => {
    res.status(200).json({ success: true, payload: res.campus })
});


router.post('/', async (req, res) => {
        let campus;
        if(req.query.id){
            if(req.query.name){
                let moreAttr = {}
                for(var prop in req.body){
                    moreAttr[prop] = req.body[prop]
                }
                campus = new Campus({_id: req.query.id, name: req.query.name, moreAttr:moreAttr})
            }
        }else{
            if(req.query.name){
                let moreAttr = {}
                for(var prop in req.body){
                    moreAttr[prop] = req.body[prop]
                }
                campus = new Campus({ name: req.query.name, moreAttr:moreAttr})
            }
        }
    try{
        const newCampus = await campus.save();
        res.status(201).json({success:true, payload:newCampus})
    }
    catch(err){
        res.status(400).json({success:true, message: err.message})
    }    
});

router.patch('/:campusId', getCampus, (req, res) => {
    res.status(200).json({ success: true, payload: res.campus }).end();
});

router.delete('/:campusId', getCampus, async (req, res) => {
    try{
        let deleteResponse = await res.campus.delete()
        res.status(200).json({ success: true, payload: deleteResponse }).end();
        }
        catch (err){
            res.status(500).json({"success":false, message: err.message}).end()
        }
});



module.exports = router;