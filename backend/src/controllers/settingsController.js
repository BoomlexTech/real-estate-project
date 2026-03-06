const SiteSettings = require('../models/SiteSettings');

exports.getSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findById('singleton') || { companyBrochureUrl: '' };
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { companyBrochureUrl } = req.body;
    const settings = await SiteSettings.findByIdAndUpdate(
      'singleton',
      { companyBrochureUrl },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};
