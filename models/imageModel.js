const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    uri: {  // Using `uri` to store the S3 URI of the image
      type: String, 
      required: true 
    },  
  },
  { collection: "imagevault", versionKey: false }
);

module.exports = mongoose.model('Image', imageSchema);