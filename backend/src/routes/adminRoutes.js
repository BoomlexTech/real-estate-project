const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getAgents,
  approveAgent,
  rejectAgent,
  deleteAgent,
  getAllProperties,
  forceDeleteProperty,
  getInquiries,
  updateInquiryStatus,
  getContactMessages,
  updateContactMessageStatus,
  getPropertyInquiries,
  updatePropertyInquiryStatus,
  getNotifications,
  markNotificationsSeen,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleAuth');

// All admin routes require a valid JWT + admin role
router.use(protect, isAdmin);

// Dashboard
router.get('/dashboard', getDashboard);

// Agents
router.get('/agents', getAgents);
router.patch('/agents/:id/approve', approveAgent);
router.patch('/agents/:id/reject', rejectAgent);
router.delete('/agents/:id', deleteAgent);

// Properties
router.get('/properties', getAllProperties);
router.delete('/properties/:id', forceDeleteProperty);

// Mortgage inquiries
router.get('/inquiries', getInquiries);
router.patch('/inquiries/:id/status', updateInquiryStatus);

// Contact messages
router.get('/contact-messages', getContactMessages);
router.patch('/contact-messages/:id/status', updateContactMessageStatus);

// Property inquiries
router.get('/property-inquiries', getPropertyInquiries);
router.patch('/property-inquiries/:id/status', updatePropertyInquiryStatus);

// Notifications
router.get('/notifications', getNotifications);
router.patch('/notifications/seen', markNotificationsSeen);

module.exports = router;
