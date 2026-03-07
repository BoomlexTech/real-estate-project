const Agent = require('../models/Agent');
const Property = require('../models/Property');
const AgentReview = require('../models/AgentReview');

// GET /api/agents
const getAgents = async (req, res, next) => {
    try {
        const agents = await Agent.find({ isApproved: true })
            .select('-password')
            .sort({ name: 1 });

        const result = await Promise.all(
            agents.map(async (agent) => {
                const propertyCount = await Property.countDocuments({ agent: agent._id });
                return { ...agent.toObject(), propertyCount };
            })
        );

        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/agents/:id
const getAgentById = async (req, res, next) => {
    try {
        console.log('Fetching agent with ID:', req.params.id);
        const agent = await Agent.findById(req.params.id).select('-password');

        if (!agent) {
            console.warn('Agent not found for ID:', req.params.id);
            return res.status(404).json({ success: false, message: 'Agent not found' });
        }

        console.log('Found agent:', agent.name);
        const properties = await Property.find({ agent: agent._id })
            .populate('developer', 'name logo slug')
            .sort({ createdAt: -1 });

        const propertyCount = properties.length;

        res.json({
            agent: { ...agent.toObject(), propertyCount },
            properties,
        });
    } catch (err) {
        next(err);
    }
};

// PUT /api/agents/profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, whatsapp, photo, languages, specialization, bio } = req.body;

        const agent = await Agent.findById(req.user._id);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        if (name !== undefined) agent.name = name;
        if (phone !== undefined) agent.phone = phone;
        if (whatsapp !== undefined) agent.whatsapp = whatsapp;
        if (photo !== undefined) agent.photo = photo;
        if (languages !== undefined) agent.languages = Array.isArray(languages) ? languages : [];
        if (specialization !== undefined) agent.specialization = specialization;
        if (bio !== undefined) agent.bio = bio;

        await agent.save();
        console.log('Agent profile updated:', agent.email);

        const { password, ...agentData } = agent.toObject();
        res.json({ success: true, agent: agentData });
    } catch (err) {
        next(err);
    }
};

// POST /api/agents/:id/reviews
const submitReview = async (req, res, next) => {
    try {
        const { reviewerName, reviewerEmail, rating, comment } = req.body;
        if (!reviewerName || !reviewerEmail || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        const review = await AgentReview.create({
            agent: req.params.id,
            reviewerName,
            reviewerEmail,
            rating: Number(rating),
            comment,
        });
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAgents, getAgentById, updateProfile, submitReview };
