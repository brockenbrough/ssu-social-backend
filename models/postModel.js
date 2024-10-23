const mongoose = require("mongoose");

// Post schema/model
const newPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    username: { type: String, required: true },
    content: { type: String, required: true },
    imageUri: { type: String, label: "imageUri", required: false },  // Ensure this field exists
    date: { type: Date, default: Date.now },
    imageFlag: { type: Boolean, default: false }, // New field
  },
  { collection: "posts" }
);

module.exports = mongoose.model("posts", newPostSchema);