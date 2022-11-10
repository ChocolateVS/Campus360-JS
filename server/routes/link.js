const express = require('express');
const router = express.Router();

//Mongo
const { Point, Room } = require('../models/schema.js');
const { getRoom, getPoint } = require('../shared.js');
const { ObjectId } = require('mongoose').Types


function determineType(req, res, next) {
    if (res.roomId) getRoom(req, res, next)
    else if (res.pointId) getPoint(req, res, next) //Based on the type, get the object to add or remove from
        //The functions called should return 'next()'
}

function setObj(req, res, next) {
    if (res.roomId) {
        res.linkParent = res.room;
    }
    else if (res.pointId) {
        res.linkParent = res.point;
        res.twoWayLink = true;
    }
    next()
}


router.get('/:linkId', determineType, setObj, async(req, res) => {
    let resp;
    resp = res.linkParent.link_ids.find(obj => { return obj._id == req.params.linkId })
    console.log('Get link: ' + req.params.linkId)
    res.status(200).json({ success: true, payload: (resp ? resp : 'No link exists with that ID') })
});

router.get('/', determineType, setObj, (req, res, next) => {
    res.status(200).json({ success: true, payload: res.linkParent.link_ids })
});



router.post('/:linkId', determineType, setObj, async(req, res) => {
    
    try {
        let otherPoint;
        if (!res.linkParent) throw 'Could not identify object to add link to!';
        if (otherPoint = await Point.findOne({ _id: req.params.linkId })) //Check if point exists
        {
            //Add two ways
            if(res.twoWayLink && !otherPoint.link_ids.includes(res.linkParent._id)){
                otherPoint.link_ids.push(res.linkParent._id);
                await otherPoint.save();
            }

            //Add association with ID
            if (!res.linkParent.link_ids.includes(req.params.linkId))
                res.linkParent.link_ids.push(req.params.linkId)

            else throw 'ID already in link_ids'
        } else throw 'LinkID does not correspond to a point'

        const saveResult = await res.linkParent.save()
        console.log('Create link: ' + req.params.linkId)
        res.status(201).json({ success: true, payload: saveResult })
    } catch (err) {
        res.status(400).json({ "success": false, message: err.message }).end()
    }

});

router.delete('/:linkId', determineType, setObj, async(req, res) => {
    
    try {
        if (!res.linkParent) throw 'Could not identify object to delete from!';
        let modelType = res.roomId ? Room : (res.pointId ? Point : null);

        //Delete association with ID
        let deleteResponse = await modelType.updateOne({ _id: res.linkParent._id, link_ids: req.params.linkId }, { $pull: { link_ids: req.params.linkId } })
        
        //Delete two way
        if(res.twoWayLink) await Point.updateOne({ _id: req.params.linkId, link_ids: res.linkParent._id}, { $pull: { link_ids: res.linkParent._id} })
        console.log('Delete link: ' + req.params.linkId)
        res.status(200).json({ success: true, payload: deleteResponse }).end();
    } catch (err) {
        res.status(500).json({ "success": false, message: err.message }).end()
    }
});




module.exports = router