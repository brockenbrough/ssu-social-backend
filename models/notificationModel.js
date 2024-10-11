const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    actionUsername: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    postId: {
      type: String,
      default: null,
      required: false,
    },

    date: {
      type: Date,
      default: () => Date.now(),
    },
  },

  { collection: "notifications" }
);

module.exports = Notification = mongoose.model(
  "notifications",
  notificationSchema
);
