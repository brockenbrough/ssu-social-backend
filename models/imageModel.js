const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
    {
    
      name: String,
      base64Data: String,
      img: {
        data: Buffer,
        contentType: String
      }
    },
    { collection: "image_vault", versionKey: false }
);

module.exports = mongoose.model('Image', imageSchema);