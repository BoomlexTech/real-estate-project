const express = require('express');
const router = express.Router();
const { loginAdmin, registerAgent, loginAgent, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Admin
router.post('/admin/login', loginAdmin);

// Agent
router.post('/agent/register', registerAgent);
router.post('/agent/login', loginAgent);

// Shared — get current logged-in user
router.get('/me', protect, getMe);

module.exports = router;
