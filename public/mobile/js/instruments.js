/**
 * Instruments Channel Module
 * Handles instrument channel display and search functionality.
 */

import { handleSearch } from './search.js';
import { getInstrumentIcon, preloadIcons } from './instrument-icons.js';
import { addTouchOrClick } from './utils.js';

// Selected instruments list.
export const instruments = [
    { name: 'Erhu', chinese: '二胡' },
    { name: 'Guzheng', chinese: '古筝' },
    { name: 'Pipa', chinese: '琵琶' },
    { name: 'Dizi', chinese: '笛子' },
    { name: 'Suona', chinese: '唢呐' },
    { name: 'Hulusi', chinese: '葫芦丝' },
    { name: 'Ocarina', chinese: '陶笛' },
    { name: 'Violin', chinese: '小提琴' },
    { name: 'Guitar', chinese: '吉他' },
    { name: 'Piano', chinese: '钢琴' }
];

/**
 * Renders the instruments channel in dropdown menu.
 * @param {HTMLElement} container - Container element to render into.
 */
export async function renderInstruments(container) {
    if (!container) {
        console.error('Container element not found');
        return;
    }
    
    container.innerHTML = '';
    
    // Preload all icons before rendering (with error handling).
    try {
        await preloadIcons();
    } catch (error) {
        console.warn('Failed to preload icons, using fallback:', error);
    }
    
    // Create single grid for all instruments.
    const instrumentsGrid = document.createElement('div');
    instrumentsGrid.className = 'instruments-grid';
    
    // Render all instruments with iOS widget style.
    for (let index = 0; index < instruments.length; index++) {
        const instrument = instruments[index];
        const instrumentCard = document.createElement('div');
        instrumentCard.className = 'instrument-card';
        
        // Staggered animation delay for smooth entrance.
        instrumentCard.style.animationDelay = `${index * 0.03}s`;
        
        // Load icon (should be cached after preload, or use fallback).
        const iconContent = getInstrumentIcon(instrument.name);
        const iconDiv = document.createElement('div');
        iconDiv.className = 'instrument-icon';
        iconDiv.innerHTML = iconContent;
        
        const labelDiv = document.createElement('div');
        labelDiv.className = 'instrument-label';
        
        // Use DOM API instead of innerHTML for security.
        const chineseDiv = document.createElement('div');
        chineseDiv.className = 'instrument-chinese';
        chineseDiv.textContent = instrument.chinese;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'instrument-name';
        nameDiv.textContent = instrument.name;
        
        labelDiv.appendChild(chineseDiv);
        labelDiv.appendChild(nameDiv);
        
        instrumentCard.appendChild(iconDiv);
        instrumentCard.appendChild(labelDiv);
        
        // Add optimized touch/click handler to search for instrument music.
        addTouchOrClick(instrumentCard, () => {
            // Search using Chinese name only (no spaces) to avoid being parsed as song name and artist.
            const searchQuery = instrument.chinese;
            handleInstrumentSearch(searchQuery);
            // Close dropdown after selection.
            hideInstrumentsDropdown();
        });
        
        // Add keyboard support for accessibility.
        instrumentCard.setAttribute('role', 'menuitem');
        instrumentCard.setAttribute('tabindex', '0');
        instrumentCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                instrumentCard.click();
            }
        });
        
        instrumentsGrid.appendChild(instrumentCard);
    }
    
    container.appendChild(instrumentsGrid);
}


/**
 * Shows the instruments dropdown.
 */
export function showInstrumentsDropdown() {
    const dropdown = document.getElementById('instrumentsDropdown');
    const btn = document.getElementById('instrumentsBtn');
    if (dropdown) {
        dropdown.classList.remove('hidden');
        if (btn) {
            btn.setAttribute('aria-expanded', 'true');
        }
    }
}

/**
 * Hides the instruments dropdown.
 */
export function hideInstrumentsDropdown() {
    const dropdown = document.getElementById('instrumentsDropdown');
    const btn = document.getElementById('instrumentsBtn');
    if (dropdown) {
        dropdown.classList.add('hidden');
        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
        }
    }
}

/**
 * Toggles the instruments dropdown.
 */
export function toggleInstrumentsDropdown() {
    const dropdown = document.getElementById('instrumentsDropdown');
    if (dropdown) {
        if (dropdown.classList.contains('hidden')) {
            showInstrumentsDropdown();
        } else {
            hideInstrumentsDropdown();
        }
    }
}

/**
 * Handles instrument search.
 * @param {string} query - Search query (Chinese name only, no spaces).
 */
function handleInstrumentSearch(query) {
    // Set search input value (Chinese name only, no spaces).
    const songInput = document.getElementById('songInput');
    if (songInput) {
        songInput.value = query;
    }
    
    // Clear artist input.
    const artistInput = document.getElementById('artistInput');
    if (artistInput) {
        artistInput.value = '';
    }
    
    // Trigger search.
    handleSearch(1);
}

