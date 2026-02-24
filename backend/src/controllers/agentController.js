const Agent = require('../models/Agent');
const Property = require('../models/Property');

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

module.exports = { getAgents };
