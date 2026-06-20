const ContactMessage = require('../models/ContactMessage');

const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const doc = await ContactMessage.create({ name, email, phone, subject, message });

    res.status(201).json({ success: true, message: 'Message received. We will be in touch soon.', data: doc });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContactMessage };