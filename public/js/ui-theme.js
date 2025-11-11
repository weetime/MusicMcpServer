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
        // Update aria-expanded attribute.
        const isExpanded = !themeDropdown.classList.contains('hidden');
        themeBtn.setAttribute('aria-expanded', isExpanded);
    });
    
    // Keyboard support for theme button.
    themeBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            themeBtn.click();
        }
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
        item.setAttribute('role', 'option');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-selected', theme.id === getCurrentTheme() ? 'true' : 'false');
        
        if (theme.id === getCurrentTheme()) {
            item.classList.add('active');
        }
        
        // Use DOM API instead of innerHTML for security.
        const iconSpan = document.createElement('span');
        iconSpan.className = 'theme-item-icon';
        iconSpan.textContent = theme.icon;
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'theme-item-name';
        nameSpan.textContent = theme.name;
        
        const checkSpan = document.createElement('span');
        checkSpan.className = 'theme-item-check';
        const checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('width', '16');
        checkSvg.setAttribute('height', '16');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.setAttribute('stroke', 'currentColor');
        checkSvg.setAttribute('stroke-width', '2');
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', '20 6 9 17 4 12');
        checkSvg.appendChild(polyline);
        checkSpan.appendChild(checkSvg);
        
        item.appendChild(iconSpan);
        item.appendChild(nameSpan);
        item.appendChild(checkSpan);
        
        // Add click event listener.
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            setTheme(theme.id);
            hideThemeDropdown();
        });
        
        // Add keyboard support for accessibility.
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
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
        const isActive = item.dataset.themeId === currentTheme;
        if (isActive) {
            item.classList.add('active');
            item.setAttribute('aria-selected', 'true');
        } else {
            item.classList.remove('active');
            item.setAttribute('aria-selected', 'false');
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
    if (!themeDropdown || !themeBtn) return;
    
    themeDropdown.classList.remove('hidden');
    themeBtn.setAttribute('aria-expanded', 'true');
}

/**
 * Hides the theme dropdown.
 */
function hideThemeDropdown() {
    if (!themeDropdown || !themeBtn) return;
    
    themeDropdown.classList.add('hidden');
    themeBtn.setAttribute('aria-expanded', 'false');
}

