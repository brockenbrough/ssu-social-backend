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
      min: 8
    },

    date: {
      type: Date,
      default: Date.now,
    },

    role: {
      type: String,
      label: "role",
      required: true,
      default: user,
    },

    imageId: {
      type: String,
      label: "imageId",
      required: false,
    },

    profileImage: {
      type: String,
      label: "profileImage",
      required: false,
    },

    _id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
      label: '_id',
    },

    biography: {
      required: false,
      type: String,
      default: ''
    }
  },
  { collection: "users" }
);

module.exports = mongoose.model('users', newUserSchema);