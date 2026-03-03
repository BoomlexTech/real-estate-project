const Property = require('../models/Property');
const PropertyInquiry = require('../models/PropertyInquiry');

// GET /api/agents/inquiries
const getMyInquiries = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const filter = { agent: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      PropertyInquiry.find(filter)
        .populate('property', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      PropertyInquiry.countDocuments(filter),
    ]);

    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/agents/inquiries/:id/status
const updateMyInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'closed'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });

    const inquiry = await PropertyInquiry.findOne({ _id: req.params.id, agent: req.user._id });
    if (!inquiry)
      return res.status(404).json({ success: false, message: 'Inquiry not found' });

    inquiry.status = status;
    await inquiry.save();
    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

const submitPropertyInquiry = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;
    const propertyId = req.params.id;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and message are required' });
    }

    // Look up the property to get its agent
    const property = await Property.findById(propertyId).select('agent');
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const inquiry = await PropertyInquiry.create({
      name,
      email,
      phone,
      message,
      property: propertyId,
      agent: property.agent || undefined,
    });

    res.status(201).json({ success: true, message: 'Inquiry submitted. An agent will contact you shortly.', data: inquiry });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitPropertyInquiry, getMyInquiries, updateMyInquiryStatus };
