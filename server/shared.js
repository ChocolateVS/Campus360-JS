const Campus = require('./models/campus.js')

function getCustom(req, res, next) {
    try{
    res.queryObj = JSON.parse(req.query.query);
    next()
    }
    catch(ex){
        return res.status(400).json({success:false, message:ex.message})
    }
}

async function runQuery(req, res, next) {
    let query;
    try {
        if (res.queryObj){
            console.log("Query for " + JSON.stringify(res.queryObj))
            query = await Campus.find(res.queryObj);
        }
        else{
            console.log("Running find on {}")
            query = await Campus.find();
        }
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not get a output!' })
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
    let queryObj = {"blocks.floors.points._id": (req.params.pointId ? req.params.pointId : res.pointId)};
    try {
        console.log("Query for " + JSON.stringify(queryObj))
        query = await Campus.findOne(queryObj);
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not get a output!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.point = query;
    next()
}

async function getRoom(req, res, next) {
    let query;
    let queryObj = {"blocks.floors.rooms._id":(req.params.roomId ? req.params.roomId : res.roomId)};
    try {
        console.log("Query for " + JSON.stringify(queryObj))
        query = await Campus.findOne(queryObj);
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not get a output!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.room = query;
    next()
}

async function getFloor(req, res, next) {
    let query;
    let queryObj = {"blocks.floors._id": (req.params.floorId ? req.params.floorId : res.floorId)};
    try {
        console.log("Query for " + JSON.stringify(queryObj))
        query = await Campus.findOne(queryObj);
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not get a output!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.floor = query;
    next()
}

async function getBlock(req, res, next) {
    let query;
    let queryObj = {"blocks._id": (req.params.blockId ? req.params.blockId : res.blockId)};
    try {
        console.log("Query for " + JSON.stringify(queryObj))
        query = await Campus.findOne(queryObj);
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not get a output!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.block = query;
    next()
}


async function getCampus(req, res, next) {
    let query;
    let queryObj = {"_id":(req.params.campusId ? req.params.campusId : res.campusId)};
    try {
        console.log("Query for " + JSON.stringify(queryObj))
        query = await Campus.findOne(queryObj);

        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not get a output!' })
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.campus = query;
    next()
}

module.exports = {
    getCampus: getCampus,
    getFloor: getFloor,
    getBlock: getBlock,
    getRoom: getRoom,
    getPoint: getPoint,
    runQuery: runQuery,
    getCustom: getCustom
}