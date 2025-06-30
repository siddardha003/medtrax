const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/database');
const ensureAllHospitalsActive = require('./src/utils/ensureHospitalsActive');
require('dotenv').config();
const path = require('path');

// Import routes
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const hospitalRoutes = require('./src/routes/hospital');
const shopRoutes = require('./src/routes/shop');
const publicRoutes = require('./src/routes/public');
const healthRoutes = require('./src/routes/health');
const uploadsRoutes = require('./src/routes/uploads');
const reviewRoutes = require('./src/routes/review');

const notificationRoutes = require('./src/routes/notification');


// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'MedTrax Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notification', notificationRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to MedTrax - Centralized Hospital Management System API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health'
    });
});

// Serve service worker from the root
app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/medtrax/public/sw.js'));
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, async () => {
    console.log(`🚀 MedTrax Backend Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    
    // Ensure all hospitals are active
    await ensureAllHospitalsActive();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app;
