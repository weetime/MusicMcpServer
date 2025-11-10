const express = require('express');
const router = express.Router();
const neteaseService = require('../services/netease');

/**
 * Search for tracks on Netease Cloud Music.
 * GET /api/search
 * Query parameters:
 *   - q: search query (required)
 *   - limit: maximum number of results per page (default: 12, max: 50)
 *   - offset: offset for pagination (default: 0)
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit = 12, offset = 0 } = req.query;

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

    // Validate offset parameter.
    const parsedOffset = parseInt(offset);
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return res.status(400).json({
        error: {
          message: 'Offset must be a non-negative integer',
          status: 400
        }
      });
    }

    // Perform search via Netease service.
    const results = await neteaseService.search(q, parsedLimit, parsedOffset);
    
    res.json({
      success: true,
      query: q,
      source: 'netease',
      pagination: {
        total: results.total || 0,
        limit: results.limit || parsedLimit,
        offset: results.offset || parsedOffset,
        hasMore: results.hasMore || false
      },
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
 * Query parameters:
 *   - level: Audio quality level (standard, higher, exhigh, lossless, hires, jyeffect, sky, jymaster)
 *            default: exhigh (for better quality and full song access)
 */
router.get('/song-url/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Changed default to 'exhigh' for better quality and full song playback.
    const { level = 'exhigh' } = req.query;
    
    if (!id) {
      return res.status(400).json({
        error: {
          message: 'Song ID is required',
          status: 400
        }
      });
    }

    // Validate quality level.
    const validLevels = ['standard', 'higher', 'exhigh', 'lossless', 'hires', 'jyeffect', 'sky', 'jymaster'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: {
          message: `Invalid quality level. Must be one of: ${validLevels.join(', ')}`,
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
      url: url,
      level: level
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

/**
 * Test endpoint to check song URL details.
 * GET /api/test/song/:id
 */
router.get('/test/song/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const levels = ['standard', 'higher', 'exhigh', 'lossless'];
    
    const results = {};
    
    for (const level of levels) {
      const url = await neteaseService.getSongUrl(id, level);
      results[level] = url ? { available: true, url: url } : { available: false };
    }
    
    res.json({
      success: true,
      song_id: id,
      quality_test: results,
      note: 'Check which quality levels return valid URLs'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

