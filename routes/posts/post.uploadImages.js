// Import the Mongoose library, which is used to interact with MongoDB.
var mongoose = require('mongoose');

// Define a schema for the "Image" model.
var imageSchema = new mongoose.Schema({
    // Define fields for the schema:
    name: String,   // Stores the name of the image.
    desc: String,   // Stores a description of the image.
    img: {          // Stores the image data and its content type.
        data: Buffer,         // Binary image data stored as a Buffer.
        contentType: String   // Content type of the image (e.g., image/jpeg).
    }
});

// Export the schema as a Mongoose model named 'Image'.
module.exports = mongoose.model('Image', imageSchema);
