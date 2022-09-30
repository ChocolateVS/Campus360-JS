const { ObjectId } = require('mongoose').Types;
const { Project, Area, Level, Point, Room } = require('./models/schema.js')


function getCustom(req, res, next) {
    try {
        res.queryObj = JSON.parse(req.query.query);
        next()
    } catch (ex) {
        return res.status(400).json({ success: false, message: ex.message })
    }
}

async function runQuery(req, res, next) {
    let query;
    try {
        if (res.queryObj) {
            console.log("Query Custom for " + JSON.stringify(res.queryObj))
            query = await Project.find(res.queryObj).populate('areas').populate('areas.levels');;
        } else {
            console.log("Running find on {}")
            query = await Project.find().populate('areas').populate('areas.levels');
        }
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Result was empty!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    console.log(query)
    res.mongoResponse = query;
    next();
}

async function getPoint(req, res, next) {
    let query;
    let pointID = ObjectId(req.params.pointId ? req.params.pointId : res.pointId);
    try {
        console.log("Query Point for " + pointID)
        query = await Point.findById(pointID);
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find any points!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.point = query;
    next()
}

async function getRoom(req, res, next) {
    let query;
    let roomID = ObjectId(req.params.roomId ? req.params.roomId : res.roomId);
    try {
        console.log("Query Point for " + roomID)
        query = await Room.findById(roomID).populate('links');
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find any rooms!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.room = query;
    next()
}

async function getLevel(req, res, next) {
    let query;
    let queryObj = ObjectId(req.params.levelId ? req.params.levelId : res.levelId);
    try {
        console.log("Query Level for " + JSON.stringify(queryObj))
        query = await Level.findById(queryObj).populate('points').populate('rooms');
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find Level by ID!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.level = query;
    next()
}

async function getArea(req, res, next) {
    let query;
    let queryObj = ObjectId(req.params.areaId ? req.params.areaId : res.areaId);
    try {
        console.log("Query Area for " + JSON.stringify(queryObj))
        query = await Area.findById(queryObj).populate("levels");

        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find Area by ID!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    console.log(query)
    res.area = query;
    next()
}


async function getProject(req, res, next) {
    let query;
    let queryObj = ObjectId(req.params.projectId ? req.params.projectId : res.projectId);
    try {
        console.log("Query Project for " + JSON.stringify(queryObj))
        query = await Project.findById(queryObj).populate("areas");

        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find Project by ID!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.project = query;
    next()
}

module.exports = {
    getProject: getProject,
    getLevel: getLevel,
    getArea: getArea,
    getRoom: getRoom,
    getPoint: getPoint,
    runQuery: runQuery,
    getCustom: getCustom
}