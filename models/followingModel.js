const mongoose = require("mongoose");

//user schema/model
const followingSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
      required: true,
    },
    following: {
      type: [String],
      required: true,
    },
  },
  { collection: "following", versionKey: false }
);

module.exports = mongoose.model('following', followingSchema)