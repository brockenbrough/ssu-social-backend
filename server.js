const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 8095;

// Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn = mongoose.connection;

conn.once('open', () => {
  // Initialize GridFS stream
  Grid(conn.db, mongoose.mongo);
});

// Set up swagger
const swaggerDefinition = yaml.load("./docs/swagger.yaml");
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.use(cors());
app.use(express.json());

// Routes
app.use(require("./routes/project_notes"));
app.use(require("./routes/comments"));
app.use(require('./routes/feed'));
app.use(require('./routes/following'));
app.use(require('./routes/posts/post.createPost'))
app.use(require('./routes/posts/post.deletePost'))
app.use(require('./routes/posts/post.getAllPosts'))
app.use(require('./routes/posts/post.getPostById'))
app.use(require('./routes/posts/post.updatePost'))
app.use(require('./routes/posts/post.getAllByUsername'))
app.use(require('./routes/users/user.login'))
app.use(require('./routes/users/user.getAllUsers'))
app.use(require('./routes/users/user.signup'))
app.use(require('./routes/users/user.getuserById'))
app.use(require('./routes/users/user.editUser'))
app.use(require('./routes/users/user.deleteall'))
app.use('/user', require('./routes/users/user.uploadImages'));
app.use(require('./routes/users/user.images'))
app.use(require('./routes/statistics'))

console.log(`The node environment is: ${process.env.NODE_ENV}`);

// Production environment: connect to the database and start listening for requests
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
      setTimeout(() => {
        console.log(`All services are running on port: ${port}`);
      }, 1000); // Add a 1-second delay
    });
}

module.exports = app; // Export the app instance for unit testing.
