const express = require('express');
const router = express.Router();
const neteaseService = require('../services/netease');

/**
 * Search for tracks on Netease Cloud Music.
 * GET /api/search
 * Query parameters:
 *   - q: search query (required)
 *   - limit: maximum number of results (default: 10, max: 50)
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    // Validate query parameter.
    if (!q) {
      return res.status(400).json({
        error: {
          message: 'Query parameter "q" is required',
          status: 400
        }
      });
    }

    // Validate limit parameter.
    const parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) {
      return res.status(400).json({
        error: {
          message: 'Limit must be between 1 and 50',
          status: 400
        }
      });
    }

    // Perform search via Netease service.
    const results = await neteaseService.search(q, parsedLimit);
    
    res.json({
      success: true,
      query: q,
      source: 'netease',
      results: {
        tracks: results
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get song URL for Netease tracks.
 * GET /api/song-url/:id
 * Used to fetch the actual playback URL for Netease songs.
 */
router.get('/song-url/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { level = 'standard' } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Song ID is required',
          status: 400
        }
      });
    }

    // Get song URL from Netease.
    const url = await neteaseService.getSongUrl(id, level);
    
    if (!url) {
      return res.status(404).json({
        error: {
          message: 'Song URL not found or unavailable (may be due to copyright restrictions)',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      id: id,
      url: url
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get song lyric for Netease tracks.
 * GET /api/lyric/:id
 */
router.get('/lyric/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Song ID is required',
          status: 400
        }
      });
    }
    
    const lyric = await neteaseService.getLyric(id);
    
    if (!lyric) {
      return res.status(404).json({
        error: {
          message: 'Lyric not found',
          status: 404
        }
      });
    }
    
    res.json({
      success: true,
      id: id,
      lyric: lyric
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

