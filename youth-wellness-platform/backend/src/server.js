require("dotenv").config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const journalRoutes = require('./routes/journalRoutes');

// Import routes
const chatRoutes = require('./routes/chatRoutes');
const moodRoutes = require('./routes/moodRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const translationRoutes = require('./routes/translationRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Youth Wellness API is running!',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/translate', translationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Start server only after DB connection
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📚 Available Routes:`);
      console.log(`   POST /api/chat/init - Initialize new session`);
      console.log(`   POST /api/chat/message - Send chat message`);
      console.log(`   GET  /api/chat/history/:sessionId - Get chat history`);
      console.log(`   POST /api/mood/log - Log mood entry`);
      console.log(`   GET  /api/mood/history/:sessionId - Get mood history`);
      console.log(`   GET  /api/resources - Get resources`);
      console.log(`   POST /api/resources/seed - Seed initial resources\n`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  mongoose.connection.close();
  process.exit(0);
});

// Optional: keep-alive ping to prevent Render from sleeping
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const url =
      process.env.RENDER_EXTERNAL_URL ||
      'https://mental-wellness-xpts.onrender.com'; // replace with your Render URL
    require('http')
      .get(`${url}/`, res => console.log('Keep-alive ping:', res.statusCode))
      .on('error', err => console.error('Keep-alive error:', err.message));
  }, 10 * 60 * 1000); // every 10 min
}
