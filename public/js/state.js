/**
 * Application State Management Module
 * Manages global application state.
 */

// Application state.
export let currentTrack = null;
export let currentTrackIndex = -1; // Index of current track in playlist.
export let playlist = []; // Playlist array to store search results.
export let isPlaying = false;

// Constants.
export const MAX_HISTORY_ITEMS = 10; // Maximum number of search history items to display.

// Quality level mapping for display.
export const qualityNames = {
    'standard': 'Standard',
    'higher': 'Higher',
    'exhigh': 'Extremely High',
    'lossless': 'Lossless',
    'hires': 'Hi-Res'
};

/**
 * Sets the current track.
 * @param {Object} track - The track object.
 */
export function setCurrentTrack(track) {
    currentTrack = track;
}

/**
 * Sets the current track index.
 * @param {number} index - The track index.
 */
export function setCurrentTrackIndex(index) {
    currentTrackIndex = index;
}

/**
 * Sets the playlist.
 * @param {Array} tracks - Array of track objects.
 */
export function setPlaylist(tracks) {
    playlist = tracks;
}

/**
 * Sets the playing state.
 * @param {boolean} playing - Whether the player is playing.
 */
export function setIsPlaying(playing) {
    isPlaying = playing;
}

