const mongoose = require('mongoose');

const brochureLeadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: '', trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  message: { type: String, default: '' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
}, { timestamps: true });

// Auto-delete after 30 days
brochureLeadSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('BrochureLead', brochureLeadSchema);
