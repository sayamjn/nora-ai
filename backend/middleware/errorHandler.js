const logger = require('../utils/logger');

/**
 * Error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message} - ${err.stack}`);
  
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErrors = Object.values(err.errors).map(error => error.message);
    message = validationErrors.join(', ');
  }
  
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }
  
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  if (err.name === 'MulterError') {
    statusCode = 400;
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the limit';
    } else {
      message = err.message;
    }
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;