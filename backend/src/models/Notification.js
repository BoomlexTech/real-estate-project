const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['new_listing', 'agent_registered'], required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  message: { type: String, default: '' },
  seen: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
