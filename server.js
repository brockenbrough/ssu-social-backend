const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 8095;

// Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// Set up swagger
const swaggerDefinition = yaml.load("./docs/swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.use(cors());
app.use(express.json());

// Import routes
app.use(require("./routes/project_notes"));
app.use(require("./routes/comments"));
app.use(require("./routes/feed"));
app.use(require("./routes/following"));
app.use(require("./routes/posts/post.createPost"));
app.use(require("./routes/posts/post.deletePost"));
app.use(require("./routes/posts/post.getAllPosts"));
app.use(require("./routes/posts/post.getPostPage"));
app.use(require("./routes/posts/post.getPostPageByUsername"));
app.use(require("./routes/posts/post.getPostById"));
app.use(require("./routes/posts/post.updatePost"));
app.use(require("./routes/posts/post.search"));

app.use(require("./routes/notifications/createNotification"));
app.use(require("./routes/notifications/getNotificationByUsername"));
app.use(require("./routes/notifications/updateNotification"));
app.use(require("./routes/notifications/deleteNotificationById"));
app.use(require("./routes/notifications/deleteNotificationByUsername"));
app.use(require("./routes/images"));
app.use(require("./routes/posts/post.getAllByUsername"));
app.use(require("./routes/users/user.login"));
app.use(require("./routes/users/user.getAllUsers"));
app.use(require("./routes/users/user.signup"));
app.use(require("./routes/users/user.getuserById"));
app.use(require("./routes/users/user.getUsersByIds"));
app.use(require("./routes/users/user.search"));
app.use(require("./routes/users/user.editUser"));
app.use(require("./routes/users/user.deleteall"));
app.use(require("./routes/users/user.refresh-token"));
app.use(require("./routes/users/user.getUserByUsername"));
app.use(require("./routes/users/user.updateBioByID"))
app.use(require("./routes/statistics"));
app.use(require("./routes/users/user.deleteById"));
app.use(require("./routes/users/user.generateToken"));
app.use(require("./routes/users/user.getProfileImage"));
app.use(require("./routes/chat/chatRoom/createChatRoom"));
app.use(require("./routes/chat/chatRoom/getChatRoomByUserId"));
app.use(require("./routes/chat/message/createMessage"));
app.use(require("./routes/chat/message/getMessageByChatRoomId"));
app.use(require("./routes/chat/message/getLastMessageByChatRoomIds"));
app.use(require("./routes/chat/message/getMessageByUserId"));
app.use(require("./routes/chat/message/getUnreadMessageByUserId"));
app.use(require("./routes/chat/message/updateMessageMarkAsRead"));

// get driver connection
const connectDB = require("./db/conn");

// Create an HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  console.log(`Total clients connected: ${io.engine.clientsCount}`);

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("comment", (data) => {
    io.emit("comment", data); 
  });

  socket.on("deleteComment", (data) => {
    io.emit("deleteComment", data); 
  });

  socket.on("disconnect", () => {});
});
if (process.env.NODE_ENV !== "test") {
  connectDB();
  server.listen(port, () => {
    setTimeout(() => {
      console.log(`Your backend is running on port ${port}`);
    }, 1000);
  });
}

module.exports = { app, server };
