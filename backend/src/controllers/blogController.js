const BlogPost = require('../models/BlogPost');

// GET /api/blog — public, approved posts only
const getBlogPosts = async (req, res, next) => {
    try {
        const posts = await BlogPost.find({ status: 'approved' }).sort({ publishedAt: -1 });
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

// GET /api/blog/:slug — public
const getBlogPost = async (req, res, next) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, status: 'approved' });
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
        const filter = req.query.pendingOnly === 'true' ? { status: 'pending' } : {};
        const total = await BlogPost.countDocuments(filter);
        const posts = await BlogPost.find(filter)
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

// POST /api/admin/blogs — admin creates post, goes live immediately
const createBlogPost = async (req, res, next) => {
    try {
        const { title, content, excerpt, coverImage, author, category, tags, isFeatured } = req.body;
        const slug = (req.body.slug || title)
            .toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        const post = await BlogPost.create({ title, slug, content, excerpt, coverImage, author, category, tags, isFeatured, status: 'approved' });
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

// POST /api/blog/submit — agent submits a blog post for approval
const submitAgentBlog = async (req, res, next) => {
    try {
        const { title, content, excerpt, coverImage, author, category, tags } = req.body;
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'title and content are required' });
        }
        let slug = (title)
            .toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        const exists = await BlogPost.findOne({ slug });
        if (exists) slug = `${slug}-${Date.now()}`;
        const post = await BlogPost.create({
            title, slug, content,
            excerpt: excerpt || '',
            coverImage: coverImage || '',
            author: author || req.user.name || '',
            category: category || 'Market Insights',
            tags: tags || [],
            status: 'pending',
            submittedBy: req.user._id,
            submittedByName: req.user.name || '',
        });
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        next(err);
    }
};

// GET /api/blog/mine — agent's own submissions
const getMyBlogPosts = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const filter = { submittedBy: req.user._id };
        const [data, total] = await Promise.all([
            BlogPost.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            BlogPost.countDocuments(filter),
        ]);
        res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/blog/mine/:id — agent deletes their own submission
const deleteMyBlogPost = async (req, res, next) => {
    try {
        const post = await BlogPost.findOne({ _id: req.params.id, submittedBy: req.user._id });
        if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
        await post.deleteOne();
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBlogPosts, getBlogPost, getAdminBlogPosts, getBlogPostById,
    createBlogPost, updateBlogPost, deleteBlogPost,
    submitAgentBlog, getMyBlogPosts, deleteMyBlogPost,
};
