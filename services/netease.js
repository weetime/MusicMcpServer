const axios = require('axios');

/**
 * Netease Cloud Music API service.
 * This service integrates with NeteaseCloudMusicApi for searching and playing music.
 */
class NeteaseService {
  constructor() {
    // Base URL for Netease API (can be local or deployed instance)
    this.baseURL = process.env.NETEASE_API_URL || 'http://localhost:4000';
  }

  /**
   * Searches for tracks on Netease Cloud Music.
   * @param {string} keywords - Search keywords.
   * @param {number} limit - Maximum number of results (default: 10).
   * @returns {Promise<Object>} Formatted search results.
   */
  async search(keywords, limit = 10) {
    try {
      // Use cloudsearch endpoint for better results.
      const response = await axios.get(`${this.baseURL}/cloudsearch`, {
        params: {
          keywords: keywords,
          limit: limit,
          type: 1 // 1: single tracks, 10: albums, 100: artists
        }
      });

      if (response.data.code !== 200) {
        throw new Error('Netease API returned error: ' + response.data.code);
      }

      return this.formatSearchResults(response.data.result);
    } catch (error) {
      console.error('Netease search error:', error.message);
      throw new Error('Failed to search on Netease Cloud Music');
    }
  }

  /**
   * Gets playable URL for a song.
   * @param {string|number} id - Song ID.
   * @param {string} level - Audio quality level (standard, higher, exhigh, lossless).
   * @returns {Promise<string|null>} Song URL or null if not available.
   */
  async getSongUrl(id, level = 'standard') {
    try {
      const response = await axios.get(`${this.baseURL}/song/url/v1`, {
        params: {
          id: id,
          level: level
        }
      });

      if (response.data.code !== 200 || !response.data.data || response.data.data.length === 0) {
        console.warn(`No URL found for song ${id}`);
        return null;
      }

      return response.data.data[0].url;
    } catch (error) {
      console.error('Get song URL error:', error.message);
      return null;
    }
  }

  /**
   * Gets song lyric.
   * @param {string|number} id - Song ID.
   * @returns {Promise<Object|null>} Lyric data or null.
   */
  async getLyric(id) {
    try {
      const response = await axios.get(`${this.baseURL}/lyric`, {
        params: { id: id }
      });

      if (response.data.code !== 200) {
        return null;
      }

      return {
        lyric: response.data.lrc?.lyric || null,
        tlyric: response.data.tlyric?.lyric || null // Translated lyric
      };
    } catch (error) {
      console.error('Get lyric error:', error.message);
      return null;
    }
  }

  /**
   * Formats search results to match the frontend format.
   * @param {Object} result - Raw search result from Netease API.
   * @returns {Object} Formatted results compatible with frontend.
   */
  formatSearchResults(result) {
    if (!result || !result.songs || result.songs.length === 0) {
      return { items: [] };
    }

    return {
      items: result.songs.map(song => ({
        id: song.id,
        name: song.name,
        artists: song.ar.map(artist => ({
          name: artist.name,
          id: artist.id
        })),
        album: {
          name: song.al.name,
          id: song.al.id,
          images: [
            { url: song.al.picUrl }
          ]
        },
        // Mark as netease source for frontend handling.
        preview_url: `netease:${song.id}`,
        duration_ms: song.dt,
        source: 'netease'
      }))
    };
  }

  /**
   * Checks if Netease API is available.
   * @returns {Promise<boolean>} True if API is reachable.
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.baseURL}/`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      console.error('Netease API health check failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance.
module.exports = new NeteaseService();

