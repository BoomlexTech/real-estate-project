const express = require('express');
const router = express.Router();
const { getAgents, getAgentById, updateProfile, submitReview } = require('../controllers/agentController');
const { getMyInquiries, updateMyInquiryStatus } = require('../controllers/propertyInquiryController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getAgents);

// Protected — must be before /:id to avoid param collision
router.put('/profile', protect, updateProfile);
router.get('/inquiries', protect, getMyInquiries);
router.patch('/inquiries/:id/status', protect, updateMyInquiryStatus);

// Public — wildcard param last
router.get('/:id', getAgentById);
router.post('/:id/reviews', submitReview);

module.exports = router;
