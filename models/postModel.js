const mongoose = require("mongoose");
//post schema/model
const newPostSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
        label: "username",
    },
    content: {
        type: String,
        required: true,
    },
  
  },
    {collection: "posts"}
);
module.exports = mongoose.model('posts', newPostSchema);