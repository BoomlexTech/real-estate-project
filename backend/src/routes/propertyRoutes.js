const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  getPropertyByObjectId,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFeatured,
  trackBrochureDownload,
  getMyPropertiesAnalytics,
  deleteMyBrochureLead,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');
const { isAdmin, isApprovedAgent, isOwnerOrAdmin } = require('../middleware/roleAuth');
const { submitPropertyInquiry } = require('../controllers/propertyInquiryController');

// Public
router.get('/', getProperties);
// Protected — must come before /:slug to avoid slug collision
router.get('/mine', protect, isApprovedAgent, getMyProperties);
// Agent analytics — own properties + their brochure leads
router.get('/mine/analytics', protect, isApprovedAgent, getMyPropertiesAnalytics);
router.delete('/mine/analytics/leads/:leadId', protect, isApprovedAgent, deleteMyBrochureLead);
// Protected — fetch single property by MongoDB _id (owner or admin)
router.get('/id/:id', protect, getPropertyByObjectId);
router.get('/:slug', getProperty);

// Protected — approved agent or admin can create
router.post('/', protect, isApprovedAgent, createProperty);

// Protected — owner agent or admin can update / delete
router.put('/:id', protect, isOwnerOrAdmin, updateProperty);
router.delete('/:id', protect, isOwnerOrAdmin, deleteProperty);

// Protected — admin only can toggle featured
router.patch('/:id/feature', protect, isAdmin, toggleFeatured);

// Public — submit inquiry for a specific property
router.post('/:id/inquiry', submitPropertyInquiry);

// Public — track brochure PDF download
router.post('/:id/brochure-download', trackBrochureDownload);

module.exports = router;
