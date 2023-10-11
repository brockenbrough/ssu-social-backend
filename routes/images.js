const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const imageSchema = require('../models/imageModel');
const fs = require('fs');
const path = require('path');
 require('dotenv').config();
 
const multer = require('multer');
 
// This is used to handle the multipart/form-data.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
const upload = multer({ storage: storage });

// Route to retreive all images stored on the server.
// It returns the images in JSON format.
// The routs is /images  (maybe we move this to a different file).)
router.get('/images/getAll', async (req, res) => {
    imageSchema.find({})
    .then((data, err)=>{
        if(err){
            console.log(err);
        }

        // We want to return this data as a JSON object to the caller.
        return res.status(200).json(data)

        // We don't want to do the render line.  This would
        // make our route return HTML instead of JSON.
        // This isn't how our API is supposed to work.
        // Also, the following line refers to "../../images" but that's
        // expaced to be a web page (like views/images.ejs) but we don't 
        // want that on the backend.
        //  res.render('../../images',{items: data})
    })
});
 

// This is the route that should save the given image.
router.post('/images/create', upload.single('image'),  async (req, res, next) => {
    // At this point, the image is saved on the server.

    // We need to get the path to the image.
    // We expect there to be a folder
    // called uploads in the root (parallel to routes folder)
    const directoryAbove = path.resolve(__dirname, '..');
    const pathToUploadedFile = path.resolve(directoryAbove, 'uploads', req.file.filename);

    // Read the image file as base64 data
    const base64Data = fs.readFileSync(pathToUploadedFile, { encoding: 'base64' });


    // We are building the image model to store on the server.
    // The img field contains the image data.
    // Notice: that we have the image saved twice: once on the server and once in the database.
    const imageToStore = imageSchema({
        name: req.body.name,
        desc: req.body.desc,
        base64Data: base64Data,  // Add the base64 data to the image schema
        img: {
            data: fs.readFileSync(path.join(pathToUploadedFile)),
            contentType: 'image/png'
        }
    });
   
  
    try {
      const response = await imageSchema.create(imageToStore);
      res.json({ msg: 'Image created successfully.' });
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ msg: 'Could not create image.' });
    }
    fs.unlink(pathToUploadedFile, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully.');
      }
    });

    // This site was used to help write this code:
    // https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
});
 
module.exports = router;