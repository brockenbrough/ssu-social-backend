const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Initialize GridFS stream
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

router.get('/profileImage/:filename', (req, res) => {
  const filename = req.params.filename;

  gfs.files.findOne({ filename: filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if the requested file is an image
    if (file.contentType.startsWith('image/')) {
      // Create a read stream for the image and pipe it to the response
      const readStream = gfs.createReadStream({ filename: filename });
      res.set('Content-Type', file.contentType);
      readStream.pipe(res);
    } else {
      res.status(400).json({ message: 'Requested file is not an image' });
    }
  });
});

module.exports = router;
