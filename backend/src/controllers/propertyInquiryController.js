const Property = require('../models/Property');
const PropertyInquiry = require('../models/PropertyInquiry');

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

module.exports = { submitPropertyInquiry };
