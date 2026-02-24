const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  author: { type: String, default: 'Real Capital Editorial' },
  category: { type: String, default: 'Market Insights' },
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
