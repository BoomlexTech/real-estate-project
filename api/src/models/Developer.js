const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  logo: { type: String, default: '' },
  description: { type: String, default: '' },
  projectsCount: { type: Number, default: 0 },
  website: { type: String, default: '' },
  featuredProjects: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Developer', developerSchema);
