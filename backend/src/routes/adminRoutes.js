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
  approvePropertyChanges,
  rejectPropertyChanges,
  getInquiries,
  updateInquiryStatus,
  getContactMessages,
  updateContactMessageStatus,
  getPropertyInquiries,
  updatePropertyInquiryStatus,
  getNotifications,
  markNotificationsSeen,
  approveBlog,
  rejectBlog,
  getReviews,
} = require('../controllers/adminController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { getAdminBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost } = require('../controllers/blogController');
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
router.patch('/properties/:id/approve', approvePropertyChanges);
router.patch('/properties/:id/reject', rejectPropertyChanges);

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

// Blog posts
router.get('/blogs', getAdminBlogPosts);
router.get('/blogs/:id', getBlogPostById);
router.post('/blogs', createBlogPost);
router.put('/blogs/:id', updateBlogPost);
router.delete('/blogs/:id', deleteBlogPost);
router.patch('/blogs/:id/approve', approveBlog);
router.patch('/blogs/:id/reject', rejectBlog);

// Agent reviews (read-only for admin)
router.get('/reviews', getReviews);

// Site settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
