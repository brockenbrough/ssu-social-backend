const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const newimgSchema = require('../../models/imageModel');
const fs = require('fs');
const path = require('path');
 require('dotenv').config();
 

 

const multer = require('multer');
 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });
 
router.get('/posts/postImages', async (req, res) => {
    newimgSchema.find({})
    .then((data, err)=>{
        if(err){
            console.log(err);
        }
        res.render('../../images',{items: data})
    })
});
 
 
router.post('/post/postImages', upload.single('image'),  async (req, res, next) => {
 
    const obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgSchema.create(obj)
    .then ((err, item) => {
        if (err) {
            console.log("not found");
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});
 
module.exports = router;