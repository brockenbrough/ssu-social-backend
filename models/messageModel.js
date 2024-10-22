const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
    immutable: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 255,
  },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

messageSchema.index({ chatRoomId: 1, senderId: 1, receiverId: 1 });

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

// Options for schema properties:
// type
// required
// default
// ref
// unique
// index
// enum
// min (Number)
// max (Number)
// minlength (String)
// maxlength (String)
// match (regex)
// validate (function)
// immutable
// trim
// uppercase
// lowercase
// auto (save date when saving a document)
