const mongoose = require('mongoose');

const mortgageInquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  loanAmountAED: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'contacted', 'approved'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('MortgageInquiry', mortgageInquirySchema);
