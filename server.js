require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Disable X-Powered-By header to prevent information exposure.
app.disable('x-powered-by');

// Middleware configuration.
app.use(cors());
app.use(express.json());

// Serve static files from public directory.
app.use(express.static(path.join(__dirname, 'public')));

// API health check endpoint.
app.get('/api/health', (req, res) => {
  res.json({
    message: 'MusicMcpServer API is running',
    version: '1.0.0',
    source: 'Netease Cloud Music',
    endpoints: {
      search: '/api/search?q=keyword&limit=10',
      songUrl: '/api/song-url/:id',
      lyric: '/api/lyric/:id'
    }
  });
});

// Routes configuration.
app.use('/api', searchRoutes);

// Error handling middleware.
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Start server.
app.listen(PORT, () => {
  console.log(`🎵 MusicMcpServer is running on port ${PORT}`);
  console.log(`🌐 Web Interface: http://localhost:${PORT}/`);
  console.log(`📍 API Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
  console.log(`⚠️  Note: Netease API must be running on port ${process.env.NETEASE_API_PORT || 4000}`);
});

