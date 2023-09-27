const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
   username: {
    type: String,
    default: '',
   },

   // add userID to associcate with comment 
   userId: {
      type: String,
      default: '',
     },
   
   commentContent:{ 
    type: String,
    default: '',
   },
   
   replies: {
      type: [String],
      required: false,
   },

   date: {
    type: Date,
    default: () => Date.now(),
   },

   /**
    * added 9/20/2023
    * team C
    */
   postId: {
      type: String,
      required: true,
   }
   
  },

   { collection: "comments" });

// comments is the name of the collection in mongodb
module.exports = Comment = mongoose.model('comments', commentsSchema)