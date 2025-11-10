/**
 * Theme UI Module
 * Handles theme selector UI interactions.
 */

import { themes, initTheme, setTheme, getCurrentTheme } from './theme.js';

// DOM elements.
let themeBtn = null;
let themeDropdown = null;
let themeList = null;

/**
 * Initializes theme UI elements.
 */
export function initThemeUI() {
    themeBtn = document.getElementById('themeBtn');
    themeDropdown = document.getElementById('themeDropdown');
    themeList = document.getElementById('themeList');
    
    if (!themeBtn || !themeDropdown || !themeList) {
        console.warn('Theme UI elements not found');
        return;
    }
    
    // Render theme list.
    renderThemeList();
    
    // Event listeners.
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleThemeDropdown();
    });
    
    // Close dropdown when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-selector')) {
            hideThemeDropdown();
        }
    });
    
    // Initialize theme system.
    initTheme();
    
    // Update UI when theme changes.
    document.addEventListener('themechange', (e) => {
        updateThemeList();
    });
}

/**
 * Renders the theme list.
 */
function renderThemeList() {
    if (!themeList) return;
    
    themeList.innerHTML = '';
    
    themes.forEach(theme => {
        const item = document.createElement('div');
        item.className = 'theme-item';
        item.dataset.themeId = theme.id;
        
        if (theme.id === getCurrentTheme()) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <span class="theme-item-icon">${theme.icon}</span>
            <span class="theme-item-name">${theme.name}</span>
            <span class="theme-item-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </span>
        `;
        
        // Add click event listener.
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            setTheme(theme.id);
            hideThemeDropdown();
        });
        
        themeList.appendChild(item);
    });
}

/**
 * Updates the theme list to reflect current theme.
 */
function updateThemeList() {
    if (!themeList) return;
    
    const items = themeList.querySelectorAll('.theme-item');
    const currentTheme = getCurrentTheme();
    
    items.forEach(item => {
        if (item.dataset.themeId === currentTheme) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Toggles the theme dropdown visibility.
 */
function toggleThemeDropdown() {
    if (!themeDropdown) return;
    
    themeDropdown.classList.toggle('hidden');
}

/**
 * Shows the theme dropdown.
 */
function showThemeDropdown() {
    if (!themeDropdown) return;
    
    themeDropdown.classList.remove('hidden');
}

/**
 * Hides the theme dropdown.
 */
function hideThemeDropdown() {
    if (!themeDropdown) return;
    
    themeDropdown.classList.add('hidden');
}

