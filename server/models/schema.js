const mongoose = require('mongoose');
require('dotenv').config()

//Empty arrays, i.e. links, areas, rooms, are made to be overwritten constantly - do NOT store important info in them

const pointSchema = new mongoose.Schema({
    type: { type: String, default: "" },
    x: { type: Number, required: [true, 'Must specify a X value'] },
    y: { type: Number, required: [true, 'Must specify a Y value'] },
    image: {
        north: { type: Number, default: 0.5 },
        directory: { type: String, default: '' },
        name: { type: String, default: "" }
    },
    description: {type: String, default: ""},
    project: {type: mongoose.SchemaTypes.ObjectId, ref:"Project"},
    area: {type: mongoose.SchemaTypes.ObjectId, ref:"Area"},
    level: {type: mongoose.SchemaTypes.ObjectId, ref:"Level"},
    link_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Point" }],
});

const roomSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Must specify Room name!'] },
    type: {type: String, default: ""},
    owner: { type: String, default: "" },
    description: {type: String, default: ""},
    project: {type: mongoose.SchemaTypes.ObjectId, ref:"Project"},
    area: {type: mongoose.SchemaTypes.ObjectId, ref:"Area"},
    level: {type: mongoose.SchemaTypes.ObjectId, ref:"Level"},
    link_ids: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Point" }],
});

const levelSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Must specify a Level name!'] },
    image: {
        scale: { type: Number, default: process.env.DEFAULT_IMAGE_SCALE, min: 0 },
        directory: { type: String, default: '' },
        name: { type: String, default: "" }
    },
    description: {type: String, default: ""},
    project: {type: mongoose.SchemaTypes.ObjectId, ref:"Project"},
    room_ids: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Room" }],
    point_ids: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Point" }],
});

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must specify Area name!']
    },
    description: {type: String, default: ""},
    project: {type: mongoose.SchemaTypes.ObjectId, ref:"Project"},
    level_ids: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Level" }],
});

const projectSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: [true, 'Must specify Project name!'] },
    description: {type: String, default: ""},
    area_ids: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Area" }],
});


let room = mongoose.model('Room', roomSchema);
let point = mongoose.model('Point', pointSchema);
let level = mongoose.model('Level', levelSchema);
let area = mongoose.model('Area', areaSchema);
let project = mongoose.model('Project', projectSchema);

module.exports = {
    Point: point,
    Level: level,
    Area: area,
    Project: project,
    Room: room
}