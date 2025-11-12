require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Disable X-Powered-By header to prevent information exposure.
app.disable('x-powered-by');

// Middleware configuration.
app.use(cors());
app.use(express.json());

// Device detection middleware.
function detectDevice(req, res, next) {
    const userAgent = req.headers['user-agent'] || '';
    // Enhanced mobile detection pattern.
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone|webOS|CriOS|FxiOS/i.test(userAgent);
    req.isMobile = isMobile;
    next();
}

// Root route with device detection and auto-redirect (must be before static files).
app.get('/', detectDevice, (req, res) => {
    if (req.isMobile) {
        res.redirect('/mobile/');
    } else {
        res.sendFile(path.join(__dirname, 'public/pc/index.html'));
    }
});

// Mobile version route.
app.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/mobile/index.html'));
});

// Serve static files for PC version (root path) - after routes to avoid conflicts.
app.use('/', express.static(path.join(__dirname, 'public/pc')));

// Serve static files for Mobile version.
app.use('/mobile', express.static(path.join(__dirname, 'public/mobile')));

// API routes configuration.
app.use('/api', apiRoutes);

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

