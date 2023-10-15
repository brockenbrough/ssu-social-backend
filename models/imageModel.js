var mongoose = require('mongoose');
var imageSchema = new mongoose.Schema(
    {
      name: String,
      
      img:
      {
        data: Buffer,
        contentType: String
      }
    },
    { collection: "image_vault", versionKey: false }
);
 
module.exports = mongoose.model('Image', imageSchema);