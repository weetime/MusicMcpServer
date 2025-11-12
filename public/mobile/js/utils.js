/**
 * Utility Functions Module
 * Provides common utility functions.
 */

/**
 * Formats time in seconds to MM:SS format.
 * @param {number} seconds - Time in seconds.
 * @returns {string} Formatted time string.
 */
export function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Escapes HTML to prevent XSS.
 * @param {string} text - Text to escape.
 * @returns {string} Escaped HTML string.
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

