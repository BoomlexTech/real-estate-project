require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const developerRoutes = require('./src/routes/developerRoutes');
const agentRoutes = require('./src/routes/agentRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const mortgageRoutes = require('./src/routes/mortgageRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/mortgage', mortgageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Real Capital API is running' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
