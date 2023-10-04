const mongoose = require("mongoose");
//post schema/model
const newPostSchema = new mongoose.Schema(
  {
    userId: {
      type : mongoose.Schema.Types.ObjectId, ref: 'users',
      required: true,
      auto: true,
      label: 'userId',
    },
    username: {
        type: String,
        required: true,
        label: "username",
    },
    content: {
        type: String,
        required: true,
    },
    img: {          // Stores the image data and its content type.
      data: Buffer,         // Binary image data stored as a Buffer.
      contentType: String   // Content type of the image (e.g., image/jpeg).
    },

    date: {
      type: Date,
      default: () => Date.now(),
     },
  },
    {collection: "posts"}
);
module.exports = mongoose.model('posts', newPostSchema);