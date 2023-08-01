const mongoose=require('mongoose');

const viewSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    postId:{
        type: String, 
        required: true
    }
})

module.exports = mongoose.model("View", viewSchema)