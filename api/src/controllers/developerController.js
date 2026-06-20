const Developer = require('../models/Developer');
const Property = require('../models/Property');

// GET /api/developers
const getDevelopers = async (req, res, next) => {
    try {
        const developers = await Developer.find().sort({ name: 1 });

        // Attach live property count for each developer
        const result = await Promise.all(
            developers.map(async (dev) => {
                const propertyCount = await Property.countDocuments({ developer: dev._id });
                return { ...dev.toObject(), propertyCount };
            })
        );

        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/developers/:slug
const getDeveloper = async (req, res, next) => {
    try {
        const developer = await Developer.findOne({ slug: req.params.slug });
        if (!developer) {
            return res.status(404).json({ success: false, message: 'Developer not found' });
        }

        const properties = await Property.find({ developer: developer._id })
            .populate('agent', 'name photo phone email')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({ ...developer.toObject(), properties });
    } catch (err) {
        next(err);
    }
};

module.exports = { getDevelopers, getDeveloper };
