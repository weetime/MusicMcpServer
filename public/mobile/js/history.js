/**
 * Search History Module
 * Manages search history functionality.
 */

import { dom } from './dom.js';
import { MAX_HISTORY_ITEMS } from './state.js';
import { handleSearch, setArtistInputModified } from './search.js';
import { confirm } from './modal.js';

/**
 * Saves a search query to history.
 * @param {string} query - The search query to save.
 */
export function saveSearchHistory(query) {
    if (!query || query.trim() === '') return;
    
    let history = getSearchHistory();
    
    // Remove duplicate if exists.
    history = history.filter(item => item !== query);
    
    // Add to the beginning.
    history.unshift(query);
    
    // Limit to MAX_HISTORY_ITEMS.
    history = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to localStorage.
    localStorage.setItem('musicSearchHistory', JSON.stringify(history));
    
    // Update display.
    renderSearchHistory();
}

/**
 * Gets search history from localStorage.
 * @returns {string[]} Array of search queries.
 */
export function getSearchHistory() {
    try {
        const history = localStorage.getItem('musicSearchHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error reading search history:', error);
        return [];
    }
}

/**
 * Renders search history list.
 */
export function renderSearchHistory() {
    const history = getSearchHistory();
    dom.searchHistoryList.innerHTML = '';
    
    if (history.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'search-history-empty';
        empty.textContent = '暂无搜索历史';
        dom.searchHistoryList.appendChild(empty);
        return;
    }
    
    history.forEach((query, index) => {
        const item = document.createElement('div');
        item.className = 'search-history-item';
        item.setAttribute('data-query', query);
        
        const icon = document.createElement('svg');
        icon.className = 'search-history-item-icon';
        icon.setAttribute('width', '20');
        icon.setAttribute('height', '20');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>';
        
        const text = document.createElement('span');
        text.className = 'search-history-item-text';
        text.textContent = query;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'search-history-item-delete';
        deleteBtn.setAttribute('title', '删除');
        deleteBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteHistoryItem(index);
        };
        
        item.appendChild(icon);
        item.appendChild(text);
        item.appendChild(deleteBtn);
        
        item.onclick = () => {
            selectHistoryItem(query);
        };
        
        dom.searchHistoryList.appendChild(item);
    });
}

/**
 * Shows search history dropdown.
 */
export function showSearchHistory() {
    // Always render history first to ensure it's up to date.
    renderSearchHistory();
    
    const history = getSearchHistory();
    if (history.length > 0) {
        dom.searchHistory.classList.remove('hidden');
    }
}

/**
 * Hides search history dropdown.
 */
export function hideSearchHistory() {
    dom.searchHistory.classList.add('hidden');
}

/**
 * Clears all search history.
 */
export async function clearSearchHistory() {
    const confirmed = await confirm('确定要清除所有搜索历史吗？', '清除历史记录');
    if (confirmed) {
        localStorage.removeItem('musicSearchHistory');
        renderSearchHistory();
        hideSearchHistory();
    }
}

/**
 * Deletes a single history item.
 * @param {number} index - Index of the item to delete.
 */
function deleteHistoryItem(index) {
    let history = getSearchHistory();
    history.splice(index, 1);
    localStorage.setItem('musicSearchHistory', JSON.stringify(history));
    renderSearchHistory();
}

/**
 * Handles search input changes.
 */
export function handleSearchInput() {
    const value = dom.songInput.value.trim();
    if (value === '') {
        showSearchHistory();
    } else {
        hideSearchHistory();
    }
}

/**
 * Selects a history item and performs search.
 * @param {string} query - The search query to use.
 */
function selectHistoryItem(query) {
    // Parse query to extract song and artist if possible.
    const parts = query.split(' ');
    if (parts.length >= 2) {
        // Try to split: assume first part is song, rest is artist.
        dom.songInput.value = parts[0];
        dom.artistInput.value = parts.slice(1).join(' ');
        // Mark artist as modified since it was set from history.
        setArtistInputModified(true);
    } else {
        dom.songInput.value = query;
        dom.artistInput.value = '';
        // Clear artist modification flag since artist is empty.
        setArtistInputModified(false);
    }
    
    hideSearchHistory();
    handleSearch();
}

