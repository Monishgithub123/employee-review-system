const mongoose = require('mongoose');
const DB = 'mongodb://localhost:27017/ersystem';

const connectDB = async () => {
  try {
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to Database :: MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
};

connectDB();

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

module.exports = db;
