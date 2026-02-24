const Property = require('../models/Property');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Admin access required' });
};

const isAgent = (req, res, next) => {
  if (req.user && (req.user.role === 'agent' || req.user.role === 'admin')) return next();
  res.status(403).json({ success: false, message: 'Agent or admin access required' });
};

const isApprovedAgent = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  if (req.user && req.user.isApproved) return next();
  res.status(403).json({ success: false, message: 'Account pending admin approval' });
};

const isOwnerOrAdmin = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (property.agent && property.agent.toString() === req.user._id.toString()) return next();
    res.status(403).json({ success: false, message: 'Not authorized to modify this property' });
  } catch (err) {
    next(err);
  }
};

module.exports = { isAdmin, isAgent, isApprovedAgent, isOwnerOrAdmin };
