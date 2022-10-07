const { ObjectId } = require('mongoose').Types;
const { Project, Area, Level, Point, Room } = require('./models/schema.js')


async function getPoint(req, res, next) {
    let query;
    let pointID = ObjectId(req.params.pointId ? req.params.pointId : res.pointId);
    try {
        console.log("Query Point for " + pointID)
        query = await Point.findById(pointID).populate('link_ids');
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find any point by id!' })
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
        query = await Room.findById(roomID).populate('link_ids')
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find any room by id!' })
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
        query = await Level.findById(queryObj).populate('point_ids').populate('room_ids')

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
        query = await Area.findById(queryObj).populate('level_ids')

        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find Area by ID!' })
        }

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.area = query;
    next()
}


async function getProject(req, res, next) {
    let query;
    let queryObj = ObjectId(req.params.projectId ? req.params.projectId : res.projectId);
    try {
        console.log("Query Project for " + JSON.stringify(queryObj))

        query = await Project.findById(queryObj).populate('area_ids')
        console.log(query.area_ids)
        
        if (query == null) {
            return res.status(404).json({ success: false, message: 'Could not find Project by ID!' })
        }

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
    res.project = query;
    next()
}


async function recursiveDelProject(ids) {
    //Find subitems to delete
    for (var id in ids) {
        let project = await Area.findById(IDs[id])
        if (!project) continue;
        await recursiveDelArea(project.area_ids)
    }

    await Project.deleteMany({ _id: { $in: ids } })
}

async function recursiveDelArea(ids) {
    for (var id in ids) {
        let area = await Area.findById(IDs[id])
        if (!area) continue;
        await recursiveDelLevel(area.level_ids)
    }
    await Project.updateMany({ area_ids: { $in: ids } }, { $pull: { area_ids: { $in: ids } } });

    await Area.deleteMany({ _id: { $in: ids } })
}

async function recursiveDelLevel(ids) {
    for (var id in ids) {
        let level = await Area.findById(IDs[id])
        if (!level) continue;
        await recursiveDelPoint(level.point_ids)
        await recursiveDelRoom(level.room_ids)
    }
    await Area.updateMany({ level_ids: { $in: ids } }, { $pull: { level_ids: { $in: ids } } });

    await Level.deleteMany({ _id: { $in: ids } })
}
async function recursiveDelPoint(ids) {
    await Level.updateMany({ 'point_ids': { $in: ids } }, { $pull: { point_ids: { $in: ids } } });
    await Point.updateMany({ 'link_ids': { $in: ids } }, { $pull: { link_ids: { $in: ids } } });
    await Level.updateMany({ 'room_ids.point_ids': { $in: ids } }, { $pull: { room_ids: { point_ids: { $in: ids } } } });

    await Point.deleteMany({ _id: { $in: ids } })
}
async function recursiveDelRoom(ids) {
    await Level.updateMany({ room_ids: { $in: ids } }, { $pull: { room_ids: { $in: ids } } });

    await Room.deleteMany({ _id: { $in: ids } })
}


module.exports = {
    getProject,
    getLevel,
    getArea,
    getRoom,
    getPoint,
    recursiveDelProject,
    recursiveDelLevel,
    recursiveDelRoom,
    recursiveDelPoint,
    recursiveDelArea
}
