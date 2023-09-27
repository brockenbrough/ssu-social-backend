const mongoose = require("mongoose");
//post schema/model
const newPostSchema = new mongoose.Schema(
  {
    _id: {
      required: true,
      type : mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId(),
      label: '_id',
    },
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
<<<<<<< HEAD
    
=======

    date: {
      type: Date,
      default: () => Date.now(),
     },

>>>>>>> dff84c7509e7826726b1f9edad4e3131cf5f7125
  },
    {collection: "posts"}
);
module.exports = mongoose.model('posts', newPostSchema);