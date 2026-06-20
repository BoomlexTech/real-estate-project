const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');

// Attach user (admin or agent) from JWT
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
      req.user.role = 'admin';
    } else {
      req.user = await Agent.findById(decoded.id).select('-password');
      if (!req.user) return res.status(401).json({ success: false, message: 'Agent not found' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
