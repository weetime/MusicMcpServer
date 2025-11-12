/**
 * Theme Management Module
 * Handles theme switching and persistence.
 */

// Available themes.
export const themes = [
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'blue', name: 'Blue', icon: '💙' },
    { id: 'purple', name: 'Purple', icon: '💜' },
    { id: 'green', name: 'Green', icon: '💚' },
    { id: 'orange', name: 'Orange', icon: '🧡' }
];

// Storage key for theme preference.
const THEME_STORAGE_KEY = 'musicEcho_theme';

// Current theme.
let currentTheme = 'dark';

/**
 * Gets the current theme.
 * @returns {string} The current theme ID.
 */
export function getCurrentTheme() {
    return currentTheme;
}

/**
 * Gets the saved theme from localStorage or returns default.
 * @returns {string} The theme ID.
 */
function getSavedTheme() {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved && themes.some(t => t.id === saved)) {
            return saved;
        }
    } catch (e) {
        console.warn('Failed to read theme from localStorage:', e);
    }
    return 'dark'; // Default theme.
}

/**
 * Saves the theme to localStorage.
 * @param {string} themeId - The theme ID to save.
 */
function saveTheme(themeId) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
    }
}

/**
 * Applies the theme to the document.
 * @param {string} themeId - The theme ID to apply.
 */
function applyTheme(themeId) {
    if (!themes.some(t => t.id === themeId)) {
        console.warn(`Invalid theme ID: ${themeId}`);
        return;
    }
    
    document.documentElement.setAttribute('data-theme', themeId);
    currentTheme = themeId;
    saveTheme(themeId);
}

/**
 * Initializes the theme system.
 * Loads saved theme or applies default.
 */
export function initTheme() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
}

/**
 * Sets the theme.
 * @param {string} themeId - The theme ID to set.
 */
export function setTheme(themeId) {
    if (!themes.some(t => t.id === themeId)) {
        console.warn(`Invalid theme ID: ${themeId}`);
        return;
    }
    
    applyTheme(themeId);
    
    // Dispatch custom event for theme change.
    const event = new CustomEvent('themechange', {
        detail: { theme: themeId }
    });
    document.dispatchEvent(event);
}

/**
 * Cycles to the next theme.
 * @returns {string} The new theme ID.
 */
export function cycleTheme() {
    const currentIndex = themes.findIndex(t => t.id === currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme.id);
    return nextTheme.id;
}

/**
 * Gets theme info by ID.
 * @param {string} themeId - The theme ID.
 * @returns {Object|null} Theme object or null if not found.
 */
export function getThemeInfo(themeId) {
    return themes.find(t => t.id === themeId) || null;
}

