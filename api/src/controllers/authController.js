const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/admin/login
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(user._id, 'admin');
    res.json({
      success: true,
      token,
      user: { id: user._id, email: user.email, role: 'admin' },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/agent/register
const registerAgent = async (req, res, next) => {
  try {
    const { name, email, password, phone, languages, specialization, bio } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });

    const existing = await Agent.findOne({ email });
    if (existing)
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });

    await Agent.create({
      name,
      email,
      password,
      phone: phone || '',
      languages: Array.isArray(languages) ? languages : [],
      specialization: specialization || '',
      bio: bio || '',
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Your account is pending admin approval.',
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/agent/login
const loginAgent = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const agent = await Agent.findOne({ email });
    if (!agent || !(await agent.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!agent.isApproved)
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please check back later.',
      });

    const token = signToken(agent._id, 'agent');
    res.json({
      success: true,
      token,
      user: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: 'agent',
        photo: agent.photo,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (requires protect middleware)
const getMe = async (req, res) => {
  const u = req.user;
  if (u.role === 'admin') {
    return res.json({
      success: true,
      user: { id: u._id, email: u.email, role: 'admin' },
    });
  }
  res.json({
    success: true,
    user: {
      id: u._id,
      name: u.name,
      email: u.email,
      role: 'agent',
      photo: u.photo,
      isApproved: u.isApproved,
    },
  });
};

module.exports = { loginAdmin, registerAgent, loginAgent, getMe };
