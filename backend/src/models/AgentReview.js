const mongoose = require('mongoose');

const agentReviewSchema = new mongoose.Schema({
  agent:         { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
  reviewerName:  { type: String, required: true, trim: true },
  reviewerEmail: { type: String, required: true, trim: true, lowercase: true },
  rating:        { type: Number, required: true, min: 1, max: 5 },
  comment:       { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('AgentReview', agentReviewSchema);
