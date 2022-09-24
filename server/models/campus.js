const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {type: String, default:""},
    x:{ type:Number, required:[true, 'Must specify a X value']},
    y:{ type:Number, required:[true, 'Must specify a Y value']},
    gyro_data:{type:String},
    links:[{
        pointID:{ type:mongoose.Schema.Types.ObjectId, required:true, ref:"Campus.blocks.floors.point"}
    }]
});

const roomSchema = new mongoose.Schema({
    name:{ type:String, required:[true, 'Must specify Room name!']},
    owner: { type:String},
    point:[{
        pointID:{ type:mongoose.SchemaTypes.ObjectId, required:true, ref:"Campus.blocks.floors.point"}
    }]
    });

const floorSchema = new mongoose.Schema({
    level: { type:Number, required: [true, 'Must specify which level the Floor is!']},
    image_scale: { type:Number, default: 1, min: 0},
    local_directory: {type:String, default: "./images"},
    floorplan_file: { type: String},
    rooms:[roomSchema],
    points:[pointSchema]
    });

const blockSchema = new mongoose.Schema({
    name: { 
        type:String, required:[true, 'Must specify Block name!'] 
    },
    floors:[floorSchema]
});

const campusSchema = new mongoose.Schema({
    name:{ type: String, required: [true, 'Must specify Campus name!'] },
    blocks:[blockSchema]
});

module.exports = mongoose.model('Campus', campusSchema)