/**
 * Search Module
 * Handles music search functionality with pagination support.
 */

import { dom } from './dom.js';
import { saveSearchHistory, hideSearchHistory } from './history.js';
import { showLoading, hideLoading } from './ui.js';
import { hideResults } from './ui.js';
import { displayResults, setPaginationQuery } from './results.js';

// Search state.
let currentQuery = '';
let currentPage = 1;
const PAGE_SIZE = 12;

// Track if artist input was manually modified by user.
let artistInputModified = false;

/**
 * Sets the artist input modification flag.
 * @param {boolean} modified - Whether the artist input was modified.
 */
export function setArtistInputModified(modified) {
    artistInputModified = modified;
}

/**
 * Handles search button click.
 * Default music source is Netease Cloud Music for better Chinese song support.
 * @param {number} page - Page number (default: 1).
 * @param {string} queryOverride - Optional query string to override input values (for pagination).
 */
export async function handleSearch(page = 1, queryOverride = null) {
    let query;
    
    if (queryOverride) {
        // Use provided query (for pagination).
        query = queryOverride;
    } else {
        // Get query from input fields.
        const song = dom.songInput.value.trim();
        const artist = dom.artistInput.value.trim();
        
        if (!song) {
            alert('Please enter a song name!');
            return;
        }
        
        // Build search query for Netease (simply combine with space).
        // Only include artist if it was manually modified by user.
        query = song;
        if (artist && artistInputModified) {
            query += ` ${artist}`;
        }
        
        // Reset artist input modification flag after building query for new search.
        // This ensures that if user doesn't modify artist input, it won't be used in next search.
        if (page === 1) {
            artistInputModified = false;
        }
    }
    
    // Save to search history (only for first page).
    if (page === 1) {
        saveSearchHistory(query);
    }
    
    // Hide search history.
    hideSearchHistory();
    
    // Show loading state.
    showLoading();
    if (page === 1) {
        hideResults();
    }
    // Don't hide player - keep it visible if playing
    
    try {
        // Calculate offset for pagination.
        const offset = (page - 1) * PAGE_SIZE;
        
        // Search via Netease Cloud Music API.
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&offset=${offset}`
        );
        
        if (!response.ok) {
            throw new Error('搜索失败，请稍后重试');
        }
        
        const data = await response.json();
        
        if (data.success && data.results.tracks && data.results.tracks.items.length > 0) {
            // Update search state.
            currentQuery = query;
            currentPage = page;
            
            // Update pagination query in results module.
            setPaginationQuery(query);
            
            // Display results with pagination info.
            displayResults(data.results.tracks.items, data.pagination);
        } else {
            if (page === 1) {
                alert('No songs found. Please try different keywords.');
            }
            hideLoading();
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Search error: ' + error.message);
        hideLoading();
    }
}


