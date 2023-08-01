// test.config.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;
let mongoUri;

module.exports.connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = mongoServer.getUri();

  // Check if a Mongoose connection is already active, and only create a new connection if not
  if (!mongoose.connection.readyState) {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

module.exports.closeDatabase = async () => {
  // We are not calling connect.dropDatabase() since this memory server will be automatically deleted anyway
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

module.exports.getMongoUri = () => mongoUri;