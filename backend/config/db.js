const mongoose = require('mongoose');
const config = require('./default');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    logger.info(`Connecting to MongoDB with URI: ${config.mongoURI}`);
    
    const conn = await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;