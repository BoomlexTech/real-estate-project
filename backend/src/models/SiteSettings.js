const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  _id: { type: String, default: 'singleton' },
  companyBrochureUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
