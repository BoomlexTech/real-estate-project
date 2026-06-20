const express = require('express');
const router = express.Router();
const {
  getBlogPosts, getBlogPost,
  submitAgentBlog, getMyBlogPosts, deleteMyBlogPost,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { isApprovedAgent } = require('../middleware/roleAuth');

// Public routes
router.get('/', getBlogPosts);

// Agent routes (must come before /:slug to avoid conflict)
router.post('/submit', protect, isApprovedAgent, submitAgentBlog);
router.get('/mine', protect, isApprovedAgent, getMyBlogPosts);
router.delete('/mine/:id', protect, isApprovedAgent, deleteMyBlogPost);

// Public single-post route (after specific routes)
router.get('/:slug', getBlogPost);

module.exports = router;
