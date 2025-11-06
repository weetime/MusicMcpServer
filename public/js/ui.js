/**
 * UI Module
 * Handles UI state changes and display updates.
 */

import { dom } from './dom.js';

/**
 * Shows loading indicator.
 */
export function showLoading() {
    dom.loadingIndicator.classList.remove('hidden');
}

/**
 * Hides loading indicator.
 */
export function hideLoading() {
    dom.loadingIndicator.classList.add('hidden');
}

/**
 * Hides search results.
 */
export function hideResults() {
    dom.searchResults.classList.add('hidden');
}

/**
 * Hides player panel.
 */
export function hidePlayer() {
    dom.musicPlayer.classList.add('hidden');
}

