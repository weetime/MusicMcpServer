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
app.get('/api/health', async (req, res) => {
  const neteaseService = require('./services/netease');
  const loginStatus = await neteaseService.getLoginStatus();
  const neteaseHealth = await neteaseService.checkHealth();
  
  res.json({
    message: 'MusicMcpServer API is running',
    version: '2.1.0',
    source: 'Netease Cloud Music',
    netease_api_url: neteaseService.baseURL,
    netease_api_health: neteaseHealth ? 'connected' : 'disconnected',
    cookie_configured: neteaseService.hasCookie(),
    login_status: loginStatus,
    endpoints: {
      search: '/api/search?q=keyword&limit=10',
      songUrl: '/api/song-url/:id?level=higher',
      lyric: '/api/lyric/:id',
      esp32: '/api/esp32/song?q=song_name&artist=artist_name&level=higher',
      test: '/api/test/song/:id'
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

// Start the main server.
app.listen(PORT, () => {
  const neteaseService = require('./services/netease');
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎵 MusicMcpServer v2.1.0 is running!`);
  console.log(`${'='.repeat(60)}`);
  console.log(`🌐 Web Interface: http://localhost:${PORT}/`);
  console.log(`📍 API Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
  console.log(`🎼 Netease API (external): ${neteaseService.baseURL}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Server ready! Open http://localhost:${PORT}/ to start`);
  console.log(`⚠️  Make sure Netease API service is running at ${neteaseService.baseURL}`);
  console.log(`${'='.repeat(60)}\n`);
});

