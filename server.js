require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;
const NETEASE_PORT = process.env.NETEASE_PORT || 4000;

// Security: Disable X-Powered-By header to prevent information exposure.
app.disable('x-powered-by');

// Middleware configuration.
app.use(cors());
app.use(express.json());

// Serve static files from public directory.
app.use(express.static(path.join(__dirname, 'public')));

// Start NeteaseCloudMusicApi internally.
let neteaseProcess = null;
function startNeteaseApi() {
  return new Promise((resolve, reject) => {
    console.log(`🎵 Starting Netease API on port ${NETEASE_PORT}...`);
    neteaseProcess = exec(`PORT=${NETEASE_PORT} npx NeteaseCloudMusicApi`, (error) => {
      if (error) {
        console.error('Netease API process error:', error);
      }
    });

    neteaseProcess.stdout.on('data', (data) => {
      console.log(`[Netease API] ${data.trim()}`);
      if (data.includes('server running')) {
        resolve();
      }
    });

    neteaseProcess.stderr.on('data', (data) => {
      console.error(`[Netease API Error] ${data.trim()}`);
    });

    // Resolve after 3 seconds even if we don't see the message.
    setTimeout(resolve, 3000);
  });
}

// Graceful shutdown.
process.on('SIGTERM', () => {
  if (neteaseProcess) {
    neteaseProcess.kill();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  if (neteaseProcess) {
    neteaseProcess.kill();
  }
  process.exit(0);
});

// API health check endpoint.
app.get('/api/health', async (req, res) => {
  const neteaseService = require('./services/netease');
  const loginStatus = await neteaseService.getLoginStatus();
  
  res.json({
    message: 'MusicMcpServer API is running',
    version: '2.0.0',
    source: 'Netease Cloud Music',
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

// Start Netease API first, then start the main server.
startNeteaseApi().then(() => {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎵 MusicMcpServer v2.0.0 is running!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🌐 Web Interface: http://localhost:${PORT}/`);
    console.log(`📍 API Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
    console.log(`🎼 Netease API (internal): http://localhost:${NETEASE_PORT}/`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ All services ready! Open http://localhost:${PORT}/ to start`);
    console.log(`${'='.repeat(60)}\n`);
  });
}).catch(error => {
  console.error('Failed to start Netease API:', error);
  process.exit(1);
});

