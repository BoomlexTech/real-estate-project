const express = require('express');
const router = express.Router();
const { getBlogPosts, getBlogPost } = require('../controllers/blogController');

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPost);

module.exports = router;
