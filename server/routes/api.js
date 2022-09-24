const express = require('express');
const multer = require('multer');

const router = express.Router();


//MySQL
const util = require('util');
const conn = require('../db.js');
const query = util.promisify(conn.query).bind(conn);

//Routes
const campus = require('./campus.js');

//Middleware
const {getCustom, runQuery} = require('../shared.js')

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

router.get('/mongo', getCustom, runQuery, (req, res)=>{
    res.status(200).json({success:true, payload: req.mongoResponse}).end();
})

router.get('/query', async(request, response) => {
    try {
        console.log(request.headers);
        console.log(request.query);
        console.log('----');
        let item = await query(request.query.query);

        console.log(item);
        console.log('--------');
        response.json({ success: true, payload: item });
        response.end();
        return;
    } catch (err) {
        response.status(400).json({ success: false, payload: err });
        response.end();
        return;
    }
});



router.use('/campus', campus);

module.exports = router;