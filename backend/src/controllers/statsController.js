const Property = require('../models/Property');
const Developer = require('../models/Developer');
const Agent = require('../models/Agent');
const BlogPost = require('../models/BlogPost');

// GET /api/stats
const getStats = async (req, res, next) => {
    try {
        const [totalProperties, totalSold, totalDevelopers, totalAgents, totalBlogPosts] = await Promise.all([
            Property.countDocuments(),
            Property.countDocuments({ status: 'sold' }),
            Developer.countDocuments(),
            Agent.countDocuments({ isApproved: true }),
            BlogPost.countDocuments(),
        ]);

        res.json({
            totalProperties,
            totalSold: `${totalSold}+`,
            languages: 7,
            offices: 2,
            totalDevelopers,
            totalAgents,
            totalBlogPosts,
            partners: ['EMAAR', 'DAMAC', 'MERAAS', 'BINGHATTI', 'NAKHEEL'],
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStats };
