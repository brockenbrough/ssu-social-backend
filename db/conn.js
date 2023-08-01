
const mongoose = require('mongoose');
const db = process.env.ATLAS_URI;

// Set the strict query option to true before connecting to the database
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(
      db,
      {
        useNewUrlParser: true
      }
    );

    //console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;