const Agent = require('../models/Agent');
const Property = require('../models/Property');
const MortgageInquiry = require('../models/MortgageInquiry');
const Notification = require('../models/Notification');

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

    const [data, total] = await Promise.all([
      Property.find()
        .populate('agent', 'name email')
        .populate('developer', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Property.countDocuments(),
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

module.exports = {
  getDashboard,
  getAgents,
  approveAgent,
  rejectAgent,
  deleteAgent,
  getAllProperties,
  forceDeleteProperty,
  getInquiries,
  updateInquiryStatus,
  getNotifications,
  markNotificationsSeen,
};
