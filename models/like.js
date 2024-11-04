const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, {collection: "likes"});

module.exports = mongoose.model("Like", likeSchema)