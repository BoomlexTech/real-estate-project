const BlogPost = require('../models/BlogPost');

// GET /api/blog
const getBlogPosts = async (req, res, next) => {
    try {
        const posts = await BlogPost.find().sort({ publishedAt: -1 });
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

// GET /api/blog/:slug
const getBlogPost = async (req, res, next) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }
        res.json(post);
    } catch (err) {
        next(err);
    }
};

module.exports = { getBlogPosts, getBlogPost };
