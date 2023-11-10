const mongoose = require("mongoose");
//post schema/model
const newPostSchema = new mongoose.Schema(
  {
    userId: {
      type : mongoose.Schema.Types.ObjectId, ref: 'users',
      required: true,
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
    
    imageId: {
      type: String,
      label: "imageId",
      required: false,
    },

    date: {
      type: Date,
      default: () => Date.now(),
     },
  },
    {collection: "posts"}
);
module.exports = mongoose.model('posts', newPostSchema);