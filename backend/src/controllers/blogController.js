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

// GET /api/admin/blogs — paginated list for admin
const getAdminBlogPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const total = await BlogPost.countDocuments();
        const posts = await BlogPost.find()
            .sort({ publishedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({ data: posts, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/blogs/:id — fetch by _id for edit form
const getBlogPostById = async (req, res, next) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });
        res.json({ success: true, data: post });
    } catch (err) {
        next(err);
    }
};

// POST /api/admin/blogs
const createBlogPost = async (req, res, next) => {
    try {
        const { title, content, excerpt, coverImage, author, category, tags, isFeatured } = req.body;
        const slug = (req.body.slug || title)
            .toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        const post = await BlogPost.create({ title, slug, content, excerpt, coverImage, author, category, tags, isFeatured });
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        next(err);
    }
};

// PUT /api/admin/blogs/:id
const updateBlogPost = async (req, res, next) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });
        res.json({ success: true, data: post });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/admin/blogs/:id
const deleteBlogPost = async (req, res, next) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = { getBlogPosts, getBlogPost, getAdminBlogPosts, getBlogPostById, createBlogPost, updateBlogPost, deleteBlogPost };
