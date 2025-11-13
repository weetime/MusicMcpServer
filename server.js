require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');
const pageRoutes = require('./routes/pages');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: Disable X-Powered-By header to prevent information exposure.
app.disable('x-powered-by');

// ============================================
// Middleware Configuration
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// Static File Serving
// ============================================
// Serve static files for PC/Web version.
app.use('/web', express.static(path.join(__dirname, 'public/pc'), {
    setHeaders: (res, filePath) => {
        // Ensure JavaScript files are served with correct MIME type for ES modules
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    },
    // Don't serve index.html as static file, handle it in route
    index: false
}));

// Serve static files for Mobile version.
app.use('/mobile', express.static(path.join(__dirname, 'public/mobile'), {
    setHeaders: (res, filePath) => {
        // Ensure JavaScript files are served with correct MIME type for ES modules
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
    },
    // Don't serve index.html as static file, handle it in route
    index: false
}));

// ============================================
// Routes
// ============================================
// Page routes (/, /web, /mobile) - must be before API routes
app.use('/', pageRoutes);

// API routes
app.use('/api', apiRoutes);

// ============================================
// Error Handling
// ============================================
// Error handling middleware (must be last)
app.use(errorHandler);

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

