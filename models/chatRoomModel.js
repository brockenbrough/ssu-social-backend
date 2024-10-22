const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      firstMessageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },
    },
  ],
  date: { type: Date, default: Date.now },
});

chatRoomSchema.index({ "participants.userId": 1 });

const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
module.exports = ChatRoom;

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
