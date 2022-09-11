const express = require('express');
const multer = require('multer');

const util = require('util');
const router = express.Router();
const conn = require('./db.js');

const query = util.promisify(conn.query).bind(conn);

const campus = require('./campus.js');
const block = require('./block.js');
const floor = require('./floor.js');
const room = require('./room.js');
const point = require('./point.js');

//----File upload---
//Set Multer storage
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images/')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
});
var upload = multer({storage: storage});


//---File Upload segment-----
router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req);
    if(!req.file) {res.end({success:false, message:"Param name must be 'file'"}); return;}
    let file = req.file;
    if(!file) {
        res.json({ success:false, message:"Please upload a file!"});
        res.end();
        return;
    } 
    res.json({success: true, message:"Successfully received image as ./images/" + file.originalname}); 
    res.end();
});


router.get('/query', async (request, response) => {
    
    try{
        console.log(request.headers);
        console.log(request.query);
        console.log('----');
        let item = await query(request.query.query);

        console.log(item);
        console.log('--------');
        response.json({success: true, payload: item});
        response.end();
        return; 
    }
    catch (err){ 
        response.json({success: false, payload: err}); 
        response.end();
        return; 
    }
    response.json({success: false, message:"Somehow the try catch got skipped?!"});
    response.end();
});

router.use('/campus', campus);
router.use('/block', block);
router.use('/floor', floor);
router.use('/room', room);
router.use('/point', point);
module.exports = router;
