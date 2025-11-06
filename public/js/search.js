/**
 * Search Module
 * Handles music search functionality.
 */

import { dom } from './dom.js';
import { saveSearchHistory, hideSearchHistory } from './history.js';
import { showLoading, hideLoading } from './ui.js';
import { hideResults } from './ui.js';
import { displayResults } from './results.js';

/**
 * Handles search button click.
 * Default music source is Netease Cloud Music for better Chinese song support.
 */
export async function handleSearch() {
    const song = dom.songInput.value.trim();
    const artist = dom.artistInput.value.trim();
    
    if (!song) {
        alert('Please enter a song name!');
        return;
    }
    
    // Build search query for Netease (simply combine with space).
    let query = song;
    if (artist) {
        query += ` ${artist}`;
    }
    
    // Save to search history.
    saveSearchHistory(query);
    
    // Hide search history.
    hideSearchHistory();
    
    // Show loading state.
    showLoading();
    hideResults();
    // Don't hide player - keep it visible if playing
    
    try {
        // Search via Netease Cloud Music API.
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}&limit=20`
        );
        
        if (!response.ok) {
            throw new Error('搜索失败，请稍后重试');
        }
        
        const data = await response.json();
        
        if (data.success && data.results.tracks && data.results.tracks.items.length > 0) {
            displayResults(data.results.tracks.items);
        } else {
            alert('No songs found. Please try different keywords.');
            hideLoading();
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Search error: ' + error.message);
        hideLoading();
    }
}

