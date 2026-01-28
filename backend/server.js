// Load environment variables as early as possible
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/database');
const ensureAllHospitalsActive = require('./src/utils/ensureHospitalsActive');
const path = require('path');

// Import models for background job
const ReminderSchedule = require('./src/models/ReminderSchedule');
const PushSubscription = require('./src/models/PushSubscription');
const { sendPushNotification } = require('./src/utils/push');

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
const prescriptionRoute = require('./src/routes/prescription');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5003;

// Database connection will be awaited in start()

// CORS configuration - MUST BE FIRST
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
].filter(Boolean);

app.use(cors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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
app.use('/api/prescription', prescriptionRoute);

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

// Reminder processing function (from backgroundJob.js)
async function processReminders() {
  const now = new Date();
  const dueReminders = await ReminderSchedule.find({
    time: { $lte: now },
    sent: false
  }).populate('subscription');

  for (const reminder of dueReminders) {
    try {
      if (!reminder.subscription) {
        console.error(`Reminder ${reminder._id} has no subscription. Marking as sent.`);
        await ReminderSchedule.findByIdAndUpdate(reminder._id, { sent: true });
        continue;
      }
      
      await sendPushNotification(reminder.subscription, {
        title: 'Medtrax Medical Reminder',
        body: `Time to take your medicine - ${reminder.title}.`,
        icon: '/images/Medtrax-logo.png',
      });
      
      await ReminderSchedule.findByIdAndUpdate(reminder._id, { sent: true });
      console.log(`✅ Sent reminder: ${reminder.title}`);
    } catch (err) {
      console.error('Failed to send reminder:', err.message);
    }
  }
}

// Start server only after DB is connected to avoid buffering timeouts
async function start() {
  try {
    await connectDB();

    const server = app.listen(PORT, async () => {
      console.log(`Server listening on port ${PORT} (env: ${process.env.NODE_ENV})`);
      await ensureAllHospitalsActive();
      
      // Start reminder processing every 60 seconds
      console.log('🔔 Starting reminder background job...');
      setInterval(async () => {
        try {
          await processReminders();
        } catch (err) {
          console.error('Error processing reminders:', err.message);
        }
      }, 60000); // Run every 60 seconds
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', () => {
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = app;
