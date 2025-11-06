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
 * ESP32 optimized endpoint - Get song URL directly with search.
 * GET /api/esp32/song?q=<song_name>&artist=<artist_name>&level=<quality>
 * 
 * Supports multiple search modes:
 * 1. Song name only: ?q=告白气球
 * 2. Artist only: ?artist=周杰伦
 * 3. Song + Artist: ?q=告白气球&artist=周杰伦
 * 
 * Query parameters:
 *   - q: Song name (optional if artist is provided)
 *   - artist: Artist name (optional if q is provided)
 *   - level: Audio quality (standard, higher, exhigh, lossless) - default: higher
 */
router.get('/esp32/song', async (req, res, next) => {
  try {
    const { q, artist, level = 'higher' } = req.query;
    
    // At least one parameter is required.
    if (!q && !artist) {
      return res.status(400).json({
        error: 'At least one parameter is required: "q" (song name) or "artist" (artist name)',
        example: {
          song_only: '/api/esp32/song?q=告白气球',
          artist_only: '/api/esp32/song?artist=周杰伦',
          song_and_artist: '/api/esp32/song?q=告白气球&artist=周杰伦'
        }
      });
    }

    // Build search query.
    // If both q and artist are provided, combine them for better accuracy.
    let searchQuery = '';
    if (q && artist) {
      // Combine song name and artist for precise search.
      searchQuery = `${q} ${artist}`;
    } else if (q) {
      // Search by song name only.
      searchQuery = q;
    } else if (artist) {
      // Search by artist only.
      searchQuery = artist;
    }

    // Search for songs (increase limit to get more results for filtering).
    const results = await neteaseService.search(searchQuery, 20);
    
    if (!results.items || results.items.length === 0) {
      return res.status(404).json({
        error: 'No songs found',
        query: searchQuery
      });
    }

    // Filter results if both song name and artist are provided.
    let filteredResults = results.items;
    if (q && artist) {
      // Filter to match both song name and artist (case-insensitive).
      const songNameLower = q.toLowerCase();
      const artistNameLower = artist.toLowerCase();
      
      filteredResults = results.items.filter(track => {
        const trackNameMatch = track.name.toLowerCase().includes(songNameLower);
        const artistMatch = track.artists.some(a => 
          a.name.toLowerCase().includes(artistNameLower)
        );
        return trackNameMatch && artistMatch;
      });
      
      // If no exact match, fall back to all results.
      if (filteredResults.length === 0) {
        filteredResults = results.items;
      }
    } else if (artist && !q) {
      // If only artist is provided, prioritize songs by that artist.
      const artistNameLower = artist.toLowerCase();
      filteredResults = results.items.filter(track =>
        track.artists.some(a => a.name.toLowerCase().includes(artistNameLower))
      );
      
      // If no match, fall back to all results.
      if (filteredResults.length === 0) {
        filteredResults = results.items;
      }
    }

    // Try to get a playable URL from filtered results.
    for (const track of filteredResults) {
      const url = await neteaseService.getSongUrl(track.id, level);
      
      if (url) {
        // Return simplified response for ESP32.
        return res.json({
          success: true,
          song: {
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            url: url,
            duration_ms: track.duration_ms,
            quality: level
          },
          search_info: {
            query: searchQuery,
            matched: q && artist ? 'song_and_artist' : (q ? 'song_name' : 'artist_name')
          }
        });
      }
    }

    // No playable URL found.
    return res.status(404).json({
      error: 'No playable song found. Try different search terms or quality level.',
      query: searchQuery,
      results_found: filteredResults.length,
      suggestion: 'Try a different quality level or search term'
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

