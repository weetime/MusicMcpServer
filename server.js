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

// Serve static files from public directory.
app.use(express.static(path.join(__dirname, 'public')));

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

