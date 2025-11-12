/**
 * UI Module
 * Handles UI state changes and display updates.
 */

import { dom } from './dom.js';

/**
 * Shows loading overlay with smooth fade-in animation.
 */
export function showLoading() {
    const loading = dom.loadingIndicator;
    if (loading) {
        // Remove hidden class to trigger CSS transition.
        loading.classList.remove('hidden');
    }
}

/**
 * Hides loading overlay with smooth fade-out animation.
 */
export function hideLoading() {
    const loading = dom.loadingIndicator;
    if (loading) {
        // Add hidden class to trigger CSS fade-out transition.
        // The CSS transition will handle the animation smoothly.
        loading.classList.add('hidden');
    }
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

