const axios = require('axios');

/**
 * Netease Cloud Music API service.
 * This service integrates with NeteaseCloudMusicApi for searching and playing music.
 * Now using local routes (integrated into the same server).
 */
class NeteaseService {
  constructor() {
    // Base URL for Netease API - uses internal port 4000 by default.
    // Can be overridden with NETEASE_API_URL for external API usage.
    const neteasePort = process.env.NETEASE_PORT || 4000;
    this.baseURL = process.env.NETEASE_API_URL || `http://localhost:${neteasePort}`;
    
    // Cookie for authentication (enables full song access and VIP features).
    this.cookie = process.env.NETEASE_COOKIE || '';
  }
  
  /**
   * Gets request config with cookie if available.
   * @param {Object} params - Request parameters.
   * @returns {Object} Axios request config.
   */
  getRequestConfig(params = {}) {
    const config = { params };
    
    // Add cookie to request if configured.
    if (this.cookie) {
      config.params.cookie = this.cookie;
    }
    
    return config;
  }

  /**
   * Searches for tracks on Netease Cloud Music.
   * @param {string} keywords - Search keywords.
   * @param {number} limit - Maximum number of results (default: 10).
   * @param {number} offset - Offset for pagination (default: 0).
   * @returns {Promise<Object>} Formatted search results with pagination info.
   */
  async search(keywords, limit = 10, offset = 0) {
    try {
      // Use cloudsearch endpoint for better results.
      const config = this.getRequestConfig({
        keywords: keywords,
        limit: limit,
        offset: offset,
        type: 1 // 1: single tracks, 10: albums, 100: artists
      });
      
      const response = await axios.get(`${this.baseURL}/cloudsearch`, config);

      if (response.data.code !== 200) {
        throw new Error('Netease API returned error: ' + response.data.code);
      }

      const formatted = this.formatSearchResults(response.data.result);
      
      // Add pagination info.
      const total = response.data.result?.songCount || 0;
      formatted.total = total;
      formatted.offset = offset;
      formatted.limit = limit;
      formatted.hasMore = offset + limit < total;
      
      return formatted;
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
      const config = this.getRequestConfig({
        id: id,
        level: level
      });
      
      const response = await axios.get(`${this.baseURL}/song/url/v1`, config);

      if (response.data.code !== 200 || !response.data.data || response.data.data.length === 0) {
        console.warn(`No URL found for song ${id} with level ${level}`);
        return null;
      }

      const songData = response.data.data[0];
      
      // Log additional info if cookie is used.
      if (this.cookie && songData.freeTrialInfo) {
        console.log(`Song ${id}: Free trial detected, may be limited to 30s`);
      }

      return songData.url;
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
      const config = this.getRequestConfig({ id: id });
      const response = await axios.get(`${this.baseURL}/lyric`, config);

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
  
  /**
   * Checks if cookie is configured.
   * @returns {boolean} True if cookie is set.
   */
  hasCookie() {
    return this.cookie && this.cookie.length > 0;
  }
  
  /**
   * Gets login status information.
   * @returns {Promise<Object|null>} Login status or null if not logged in.
   */
  async getLoginStatus() {
    if (!this.hasCookie()) {
      return null;
    }
    
    try {
      const config = this.getRequestConfig({});
      const response = await axios.get(`${this.baseURL}/login/status`, config);
      
      if (response.data.code === 200 && response.data.data) {
        return {
          logged_in: true,
          user_id: response.data.data.profile?.userId || null,
          nickname: response.data.data.profile?.nickname || 'Unknown',
          vip_type: response.data.data.profile?.vipType || 0
        };
      }
      
      return null;
    } catch (error) {
      console.error('Get login status error:', error.message);
      return null;
    }
  }
}

// Export singleton instance.
module.exports = new NeteaseService();

