const express = require('express');
const router = express.Router();
const { getAgents, getAgentById, updateProfile } = require('../controllers/agentController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getAgents);
router.get('/:id', getAgentById);

// Protected — agent updates own profile
router.put('/profile', protect, updateProfile);

module.exports = router;
