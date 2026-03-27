const Agent = require('../models/Agent');
const Property = require('../models/Property');
const { deleteImages } = require('../utils/cloudinary');
const BlogPost = require('../models/BlogPost');
const MortgageInquiry = require('../models/MortgageInquiry');
const ContactMessage = require('../models/ContactMessage');
const PropertyInquiry = require('../models/PropertyInquiry');
const Notification = require('../models/Notification');
const AgentReview = require('../models/AgentReview');

// GET /api/admin/dashboard
// Returns counts for the stats cards
const getDashboard = async (req, res, next) => {
  try {
    const [
      totalProperties,
      totalAgents,
      pendingAgents,
      totalInquiries,
      pendingInquiries,
      unseenNotifications,
    ] = await Promise.all([
      Property.countDocuments(),
      Agent.countDocuments({ isApproved: true }),
      Agent.countDocuments({ isApproved: false }),
      MortgageInquiry.countDocuments(),
      MortgageInquiry.countDocuments({ status: 'pending' }),
      Notification.countDocuments({ seen: false }),
    ]);

    res.json({
      success: true,
      data: {
        totalProperties,
        totalAgents,
        pendingAgents,
        totalInquiries,
        pendingInquiries,
        unseenNotifications,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── AGENTS ──────────────────────────────────────────────

// GET /api/admin/agents
const getAgents = async (req, res, next) => {
  try {
    const { approved } = req.query; // ?approved=true|false  (omit for all)
    const filter = {};
    if (approved === 'true') filter.isApproved = true;
    if (approved === 'false') filter.isApproved = false;

    const agents = await Agent.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: agents });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/agents/:id/approve
const approveAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent)
      return res.status(404).json({ success: false, message: 'Agent not found' });

    agent.isApproved = true;
    await agent.save();

    // Mark the registration notification as seen
    await Notification.updateMany({ agentId: agent._id, type: 'agent_registered' }, { seen: true });

    res.json({ success: true, message: 'Agent approved', data: { id: agent._id, isApproved: true } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/agents/:id/reject
const rejectAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent)
      return res.status(404).json({ success: false, message: 'Agent not found' });

    agent.isApproved = false;
    await agent.save();

    res.json({ success: true, message: 'Agent rejected', data: { id: agent._id, isApproved: false } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/agents/:id
const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent)
      return res.status(404).json({ success: false, message: 'Agent not found' });

    await agent.deleteOne();
    res.json({ success: true, message: 'Agent deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── PROPERTIES ──────────────────────────────────────────

// GET /api/admin/properties
// Returns all properties with no public-facing filters stripped
const getAllProperties = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = req.query.pendingOnly === 'true' ? { hasPendingChanges: true } : {};

    const [data, total] = await Promise.all([
      Property.find(filter)
        .populate('agent', 'name email')
        .populate('developer', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/properties/:id  — admin force-delete
const forceDeleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};

// ─── INQUIRIES ───────────────────────────────────────────

// GET /api/admin/inquiries
const getInquiries = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      MortgageInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      MortgageInquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/inquiries/:id/status
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'contacted', 'approved'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });

    const inquiry = await MortgageInquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry)
      return res.status(404).json({ success: false, message: 'Inquiry not found' });

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// ─── CONTACT MESSAGES ────────────────────────────────────

// GET /api/admin/contact-messages
const getContactMessages = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactMessage.countDocuments(filter),
    ]);

    res.json({ success: true, data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/contact-messages/:id/status
const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'read', 'replied'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });

    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!msg)
      return res.status(404).json({ success: false, message: 'Message not found' });

    res.json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};

// ─── PROPERTY INQUIRIES ───────────────────────────────────

// GET /api/admin/property-inquiries
const getPropertyInquiries = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [data, total] = await Promise.all([
      PropertyInquiry.find(filter)
        .populate('property', 'title')
        .populate('agent', 'name email')
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

// PATCH /api/admin/property-inquiries/:id/status
const updatePropertyInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'closed'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });

    const inquiry = await PropertyInquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry)
      return res.status(404).json({ success: false, message: 'Inquiry not found' });

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// ─── NOTIFICATIONS ───────────────────────────────────────

// GET /api/admin/notifications
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .populate('agentId', 'name email')
      .populate('propertyId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/notifications/seen
const markNotificationsSeen = async (req, res, next) => {
  try {
    await Notification.updateMany({ seen: false }, { seen: true });
    res.json({ success: true, message: 'All notifications marked as seen' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/properties/:id/approve  — apply staged agent changes
const approvePropertyChanges = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });
    if (!property.hasPendingChanges)
      return res.status(400).json({ success: false, message: 'No pending changes to approve' });

    const {
      title, description, price, priceLabel, location, propertyType,
      bedrooms, bathrooms, squareFt, completionYear, completionStatus,
      paymentPlan, developer, images, amenities, status,
    } = property.pendingChanges || {};

    // Rebuild slug if title changed
    if (title && title !== property.title) {
      let newSlug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      const exists = await Property.findOne({ slug: newSlug, _id: { $ne: property._id } });
      if (exists) newSlug = `${newSlug}-${Date.now()}`;
      property.slug = newSlug;
      property.title = title;
    }

    if (description !== undefined) property.description = description;
    if (price !== undefined) {
      property.price = price;
      property.priceLabel = priceLabel || `AED ${(price / 1_000_000).toFixed(1)}M`;
    }
    if (priceLabel !== undefined) property.priceLabel = priceLabel;
    if (location !== undefined) property.location = location;
    if (propertyType !== undefined) property.propertyType = propertyType;
    if (bedrooms !== undefined) property.bedrooms = bedrooms;
    if (bathrooms !== undefined) property.bathrooms = bathrooms;
    if (squareFt !== undefined) property.squareFt = squareFt;
    if (completionYear !== undefined) property.completionYear = completionYear;
    if (completionStatus !== undefined) property.completionStatus = completionStatus;
    if (paymentPlan !== undefined) property.paymentPlan = paymentPlan;
    if (developer !== undefined) property.developer = developer;
    if (images !== undefined) {
      const removed = (property.images || []).filter((u) => !images.includes(u));
      property.images = images;
      if (removed.length) deleteImages(removed).catch(() => {});
    }
    if (amenities !== undefined) property.amenities = amenities;
    if (status !== undefined) property.status = status;

    property.pendingChanges = null;
    property.hasPendingChanges = false;

    await property.save();
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/properties/:id/reject  — discard staged agent changes
const rejectPropertyChanges = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property)
      return res.status(404).json({ success: false, message: 'Property not found' });

    property.pendingChanges = null;
    property.hasPendingChanges = false;
    await property.save();

    res.json({ success: true, message: 'Changes rejected' });
  } catch (err) {
    next(err);
  }
};

// ─── AGENT REVIEWS ───────────────────────────────────────

// GET /api/admin/reviews
const getReviews = async (req, res, next) => {
  try {
    const reviews = await AgentReview.find()
      .populate('agent', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

// ─── BLOG APPROVALS ──────────────────────────────────────

// PATCH /api/admin/blogs/:id/approve
const approveBlog = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });
    post.status = 'approved';
    await post.save();
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/blogs/:id/reject  — hard delete
const rejectBlog = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Blog post not found' });
    await post.deleteOne();
    res.json({ success: true, message: 'Blog post rejected and deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/analytics/brochure  — all properties with their brochure leads
const getBrochureAnalytics = async (req, res, next) => {
  try {
    const BrochureLead = require('../models/BrochureLead');

    const properties = await Property.find({})
      .select('title images agent createdAt')
      .populate('agent', 'name')
      .sort({ createdAt: -1 });

    const propertyIds = properties.map((p) => p._id);
    const leads = await BrochureLead.find({ property: { $in: propertyIds } }).sort({ createdAt: -1 });

    const leadsMap = {};
    leads.forEach((l) => {
      const pid = l.property.toString();
      if (!leadsMap[pid]) leadsMap[pid] = [];
      leadsMap[pid].push(l);
    });

    const data = properties.map((p) => ({ ...p.toObject(), leads: leadsMap[p._id.toString()] || [] }));
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/analytics/brochure/leads/:leadId  — admin deletes any lead
const deleteBrochureLead = async (req, res, next) => {
  try {
    const BrochureLead = require('../models/BrochureLead');
    const lead = await BrochureLead.findById(req.params.leadId);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    await lead.deleteOne();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getAgents,
  approveAgent,
  rejectAgent,
  deleteAgent,
  getAllProperties,
  forceDeleteProperty,
  approvePropertyChanges,
  rejectPropertyChanges,
  getInquiries,
  updateInquiryStatus,
  getContactMessages,
  updateContactMessageStatus,
  getPropertyInquiries,
  updatePropertyInquiryStatus,
  getNotifications,
  markNotificationsSeen,
  approveBlog,
  rejectBlog,
  getReviews,
  getBrochureAnalytics,
  deleteBrochureLead,
};
