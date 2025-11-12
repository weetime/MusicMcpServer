/**
 * Results Display Module - PC Version
 * Handles search results display and rendering with pagination support.
 */

import { dom } from './dom.js';
import { setPlaylist, playlist } from './state.js';
import { playTrack } from './player.js';
import { renderPlaylist } from './playlist.js';
import { hideLoading } from './ui.js';
import { handleSearch } from './search.js';

// Pagination state
let currentPage = 1;
let totalResults = 0;
let currentQuery = '';
const PAGE_SIZE = 12;
let shouldPreserveScroll = false;
let preservedScrollY = 0;

/**
 * Displays search results with pagination.
 * @param {Array} tracks - Array of track objects.
 * @param {Object} pagination - Pagination information.
 * @param {boolean} append - Whether to append to existing results (unused in PC version).
 */
export function displayResults(tracks, pagination = null, append = false) {
    hideLoading();
    
    if (!append) {
        // Reset for new search
        if (dom.resultsList) {
            dom.resultsList.innerHTML = '';
            dom.resultsList.style.opacity = '0';
        }
    }
    
    // Update playlist with tracks
    setPlaylist(tracks);
    
    // Update pagination state and UI.
    if (pagination) {
        totalResults = pagination.total || 0;
        currentPage = Math.floor((pagination.offset || 0) / PAGE_SIZE) + 1;
        
        // Update results count display (PC: show current page range).
        if (dom.resultsCount) {
            const start = (pagination.offset || 0) + 1;
            const end = Math.min((pagination.offset || 0) + PAGE_SIZE, totalResults);
            dom.resultsCount.textContent = `显示 ${start}-${end} / 共 ${totalResults} 条结果`;
        }
        
        // Update navigation buttons state.
        updateNavigationButtons();
    } else {
        // Fallback for backward compatibility.
        if (dom.resultsCount) {
            dom.resultsCount.textContent = `${tracks.length} result${tracks.length !== 1 ? 's' : ''}`;
        }
        // Disable navigation buttons if no pagination info.
        if (dom.prevPageBtn) dom.prevPageBtn.disabled = true;
        if (dom.nextPageBtn) dom.nextPageBtn.disabled = true;
    }
    
    // Create and append result items with staggered animation.
    tracks.forEach((track, index) => {
        const resultItem = createResultItem(track, index);
        
        // Set initial state for animation.
        resultItem.style.opacity = '0';
        resultItem.style.transform = 'translateY(20px)';
        resultItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        dom.resultsList.appendChild(resultItem);
        
        // Add staggered fade-in animation.
        setTimeout(() => {
            requestAnimationFrame(() => {
                resultItem.style.opacity = '1';
                resultItem.style.transform = 'translateY(0)';
            });
        }, index * 15); // Stagger by 15ms per item for smoother effect
    });
    
    dom.searchResults.classList.remove('hidden');
    
    // Fade in the results list.
    setTimeout(() => {
        if (dom.resultsList) {
            dom.resultsList.style.opacity = '1';
            dom.resultsList.style.transition = 'opacity 0.4s ease';
        }
    }, 50);
    
    // Reset horizontal scroll position to start.
    if (dom.resultsList) {
        setTimeout(() => {
            dom.resultsList.scrollTo({ left: 0, behavior: 'smooth' });
        }, 200);
    }
    
    // Restore scroll position if it was preserved (for pagination).
    if (shouldPreserveScroll && !append) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                window.scrollTo({ top: preservedScrollY, behavior: 'auto' });
                shouldPreserveScroll = false;
            });
        });
    }
    
    // Update playlist display.
    renderPlaylist();
}

/**
 * Sets the current query for pagination.
 * @param {string} query - Current search query.
 */
export function setPaginationQuery(query) {
    currentQuery = query;
    currentPage = 1;
    // Reset scroll preservation flag for new searches.
    shouldPreserveScroll = false;
}

/**
 * Updates navigation buttons state based on current page.
 */
function updateNavigationButtons() {
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    
    if (dom.prevPageBtn) {
        dom.prevPageBtn.disabled = currentPage <= 1;
    }
    if (dom.nextPageBtn) {
        dom.nextPageBtn.disabled = currentPage >= totalPages;
    }
}

/**
 * Goes to the previous page.
 */
export async function goToPreviousPage() {
    if (currentPage <= 1 || !currentQuery) return;
    
    // Store current scroll position to prevent page jump.
    preservedScrollY = window.scrollY;
    shouldPreserveScroll = true;
    
    // Add fade-out effect before loading new page.
    if (dom.resultsList) {
        dom.resultsList.style.opacity = '0.3';
        dom.resultsList.style.transition = 'opacity 0.2s ease';
    }
    
    const newPage = currentPage - 1;
    await handleSearch(newPage, currentQuery);
}

/**
 * Goes to the next page.
 */
export async function goToNextPage() {
    if (!currentQuery) return;
    
    const totalPages = Math.ceil(totalResults / PAGE_SIZE);
    if (currentPage >= totalPages) return;
    
    // Store current scroll position to prevent page jump.
    preservedScrollY = window.scrollY;
    shouldPreserveScroll = true;
    
    // Add fade-out effect before loading new page.
    if (dom.resultsList) {
        dom.resultsList.style.opacity = '0.3';
        dom.resultsList.style.transition = 'opacity 0.2s ease';
    }
    
    const newPage = currentPage + 1;
    await handleSearch(newPage, currentQuery);
}

/**
 * Creates a result card element in the new card style.
 * Uses DOM API instead of innerHTML to prevent XSS vulnerabilities.
 * @param {Object} track - Track object.
 * @param {number} index - Track index.
 * @returns {HTMLElement} Result card element.
 */
function createResultItem(track, index) {
    // Create card container.
    const card = document.createElement('div');
    card.className = 'result-card';
    
    // Create album art wrapper.
    const artWrapper = document.createElement('div');
    artWrapper.className = 'album-art-wrapper';
    
    // Create album art image.
    const img = document.createElement('img');
    img.className = 'album-art';
    img.src = track.album.images[0]?.url || 'https://via.placeholder.com/300';
    img.alt = track.name;
    
    // Create overlay for hover effects.
    const overlay = document.createElement('div');
    overlay.className = 'album-art-overlay';
    
    // Create artist name (will be shown in overlay).
    const artistName = document.createElement('div');
    artistName.className = 'artist-name-overlay';
    artistName.textContent = track.artists.map(a => a.name).join(', ');
    
    // Create play button overlay.
    const playButton = document.createElement('button');
    playButton.className = 'play-button';
    playButton.innerHTML = '▶';
    playButton.onclick = async (e) => {
        e.stopPropagation();
        await playTrack(track);
        renderPlaylist();
    };
    
    // Assemble overlay.
    overlay.appendChild(artistName);
    overlay.appendChild(playButton);
    
    // Assemble album art wrapper.
    artWrapper.appendChild(img);
    artWrapper.appendChild(overlay);
    
    // Create album title background (with color variation).
    const titleBg = document.createElement('div');
    titleBg.className = `album-title-bg color-${(index % 6) + 1}`;
    titleBg.textContent = track.name;
    
    // Assemble card.
    card.appendChild(artWrapper);
    card.appendChild(titleBg);
    
    // Make entire card clickable.
    card.onclick = async () => {
        await playTrack(track);
        renderPlaylist();
    };
    
    return card;
}
