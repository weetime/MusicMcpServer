/**
 * Player Control Icons Module
 * Provides SVG icons for player controls (play, pause, etc.).
 */

/**
 * Gets play icon SVG.
 * @param {number} size - Icon size (default: 20).
 * @returns {string} SVG HTML string.
 */
export function getPlayIcon(size = 20) {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
    `;
}

/**
 * Gets pause icon SVG.
 * @param {number} size - Icon size (default: 20).
 * @returns {string} SVG HTML string.
 */
export function getPauseIcon(size = 20) {
    return `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
    `;
}

/**
 * Gets play/pause icon based on playing state.
 * @param {boolean} isPlaying - Whether audio is playing.
 * @param {number} size - Icon size (default: 20).
 * @returns {string} SVG HTML string.
 */
export function getPlayPauseIcon(isPlaying, size = 20) {
    return isPlaying ? getPauseIcon(size) : getPlayIcon(size);
}

