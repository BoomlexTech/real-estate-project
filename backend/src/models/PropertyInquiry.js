const mongoose = require('mongoose');

const propertyInquirySchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true, lowercase: true },
  phone:    { type: String, required: true, trim: true },
  message:  { type: String, required: true, trim: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  agent:    { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  status:   { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

module.exports = mongoose.model('PropertyInquiry', propertyInquirySchema);