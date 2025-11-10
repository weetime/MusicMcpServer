const express = require('express');
const router = express.Router();
const neteaseService = require('../services/netease');

/**
 * Health check endpoint.
 * GET /api/health
 * Returns server status and available endpoints.
 */
router.get('/health', async (req, res) => {
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
      test: '/api/test/song/:id'
    }
  });
});

module.exports = router;

