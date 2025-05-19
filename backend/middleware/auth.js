const jwt = require('jsonwebtoken');
const config = require('../config/default');
const User = require('../models/User');

/**
 * Authentication middleware for protecting routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, config.jwtSecret);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }
  
  if (!token) {
    res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

/**
 * Admin middleware for admin-only routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};

module.exports = { protect, admin };