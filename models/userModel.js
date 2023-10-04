const mongoose = require("mongoose");

const newUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    email: {
      type: String,
      required: true,
      label: "email",
    },
    password: {
      required: true,
      type: String,
      min : 8
    },
    date: {
      type: Date,
      default: Date.now,
    },
    _id: {
      required: true,
      type : mongoose.Schema.Types.ObjectId,
      default: mongoose.Types.ObjectId(),
      label: '_id',
    }, 
    profileImage: {
      type: String,
      default: ''  
    },
  }, 
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema)