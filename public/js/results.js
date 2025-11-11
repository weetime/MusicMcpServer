/**
 * Results Display Module
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
let isLoadingMore = false;
let hasMoreResults = false;
let allLoadedTracks = []; // Store all loaded tracks for infinite scroll

/**
 * Displays search results with pagination.
 * @param {Array} tracks - Array of track objects.
 * @param {Object} pagination - Pagination information.
 * @param {boolean} append - Whether to append to existing results (for infinite scroll).
 */
export function displayResults(tracks, pagination = null, append = false) {
    hideLoading();
    isLoadingMore = false;
    
    // Check if we're on mobile (for infinite scroll)
    const isMobile = window.innerWidth < 1024;
    
    if (!append) {
        // Reset for new search
        allLoadedTracks = [];
        if (dom.resultsList) {
            dom.resultsList.innerHTML = '';
            dom.resultsList.style.opacity = '0';
        }
    } else {
        // Remove loading indicator when appending new results
        removeInfiniteScrollLoading();
    }
    
    // Handle empty results for infinite scroll
    if (tracks.length === 0 && append) {
        // No more results to load
        hasMoreResults = false;
        removeInfiniteScrollLoading();
        return;
    }
    
    // Add tracks to all loaded tracks
    allLoadedTracks = append ? [...allLoadedTracks, ...tracks] : tracks;
    
    // Update playlist with all loaded tracks
    setPlaylist(allLoadedTracks);
    
    // Update pagination state and UI.
    if (pagination) {
        totalResults = pagination.total || 0;
        currentPage = Math.floor((pagination.offset || 0) / PAGE_SIZE) + 1;
        // More accurate calculation: check if there are more items beyond current loaded items
        const currentOffset = (currentPage - 1) * PAGE_SIZE;
        const loadedCount = append ? allLoadedTracks.length : tracks.length;
        hasMoreResults = pagination.hasMore !== false && (currentOffset + loadedCount < totalResults);
        
        // Update results count display.
        if (dom.resultsCount) {
            if (isMobile && append) {
                // Mobile: show total loaded
                dom.resultsCount.textContent = `已加载 ${allLoadedTracks.length} / 共 ${totalResults} 条结果`;
            } else {
                // Desktop: show current page range
                const start = (pagination.offset || 0) + 1;
                const end = Math.min((pagination.offset || 0) + PAGE_SIZE, totalResults);
                dom.resultsCount.textContent = `显示 ${start}-${end} / 共 ${totalResults} 条结果`;
            }
        }
        
        // Update navigation buttons state (only for desktop).
        if (!isMobile) {
            updateNavigationButtons();
        }
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
    const startIndex = append ? allLoadedTracks.length - tracks.length : 0;
    tracks.forEach((track, index) => {
        const resultItem = createResultItem(track, startIndex + index);
        
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
    
    // Add loading indicator for infinite scroll (mobile only, only if there are more results)
    if (isMobile && hasMoreResults) {
        // Only add if there are more results to load and not already loading
        if (!append && !document.querySelector('.infinite-scroll-loading')) {
            addInfiniteScrollLoading();
        }
    } else if (isMobile && !hasMoreResults) {
        // Remove loading indicator if no more results
        removeInfiniteScrollLoading();
    }
    
    dom.searchResults.classList.remove('hidden');
    
    // Fade in the results list (only for first page).
    if (!append) {
        setTimeout(() => {
            if (dom.resultsList) {
                dom.resultsList.style.opacity = '1';
                dom.resultsList.style.transition = 'opacity 0.4s ease';
            }
        }, 50);
    }
    
    // Reset horizontal scroll position to start (only for first page).
    if (!append && dom.resultsList) {
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
    
    // Setup infinite scroll for mobile (both new search and append)
    if (isMobile) {
        // Always setup/update infinite scroll on mobile
        setupInfiniteScroll();
    } else {
        // Remove infinite scroll if not mobile
        removeInfiniteScroll();
    }
}

/**
 * Sets the current query for pagination.
 * @param {string} query - Current search query.
 */
export function setPaginationQuery(query) {
    currentQuery = query;
    currentPage = 1;
    allLoadedTracks = [];
    hasMoreResults = false;
    isLoadingMore = false;
    // Reset scroll preservation flag for new searches.
    shouldPreserveScroll = false;
    // Remove scroll listener
    removeInfiniteScroll();
}

/**
 * Adds loading indicator for infinite scroll.
 * Ensures only one loading indicator exists at a time.
 */
function addInfiniteScrollLoading() {
    if (!dom.resultsList) return;
    
    // Check if loading indicator already exists
    const existingLoading = dom.resultsList.querySelector('.infinite-scroll-loading');
    if (existingLoading) {
        return; // Already exists, don't add another one
    }
    
    const loading = document.createElement('div');
    loading.className = 'infinite-scroll-loading';
    loading.innerHTML = '<div class="infinite-scroll-spinner"></div><span>加载更多...</span>';
    dom.resultsList.appendChild(loading);
}

/**
 * Removes loading indicator for infinite scroll.
 */
function removeInfiniteScrollLoading() {
    if (!dom.resultsList) return;
    
    const loadingIndicator = dom.resultsList.querySelector('.infinite-scroll-loading');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

/**
 * Sets up infinite scroll for mobile.
 */
function setupInfiniteScroll() {
    // Remove existing listener
    removeInfiniteScroll();
    
    // Track scroll state - simplified for better responsiveness
    let lastScrollTop = 0;
    let ticking = false;
    
    const handleScroll = () => {
        // Prevent multiple simultaneous checks
        if (isLoadingMore || !hasMoreResults || !currentQuery) {
            return;
        }
        
        const isMobile = window.innerWidth < 1024;
        if (!isMobile) {
            removeInfiniteScroll();
            return;
        }
        
        // Get current scroll position
        const scrollTop = window.pageYOffset || 
                         document.documentElement.scrollTop || 
                         document.body.scrollTop || 0;
        
        // Get viewport and document dimensions
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        // Calculate distance to bottom
        const scrollBottom = scrollTop + windowHeight;
        const distanceToBottom = documentHeight - scrollBottom;
        
        // Trigger when within 500px of bottom (more sensitive threshold)
        // Also trigger if already at bottom (distanceToBottom <= 0) to handle initial load
        const threshold = 500;
        
        if (distanceToBottom <= threshold) {
            // Only trigger if scrolled down (not up) to avoid loading on scroll up
            if (scrollTop > lastScrollTop && !isLoadingMore) {
                loadMoreResults();
            }
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    };
    
    // Simplified scroll handler with throttling
    const scrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    };
    
    // Use simpler throttling - check every 100ms for better responsiveness
    let throttleTimeout;
    const throttledHandler = () => {
        if (throttleTimeout) {
            return;
        }
        throttleTimeout = setTimeout(() => {
            scrollHandler();
            throttleTimeout = null;
        }, 100); // Reduced from 150ms to 100ms for faster response
    };
    
    window.addEventListener('scroll', throttledHandler, { passive: true });
    
    // Store listener for removal
    window._infiniteScrollHandler = throttledHandler;
    window._infiniteScrollThrottleTimeout = throttleTimeout;
}

/**
 * Removes infinite scroll listener.
 */
function removeInfiniteScroll() {
    if (window._infiniteScrollHandler) {
        window.removeEventListener('scroll', window._infiniteScrollHandler);
        window._infiniteScrollHandler = null;
    }
    
    // Clear throttle timeout
    if (window._infiniteScrollThrottleTimeout) {
        clearTimeout(window._infiniteScrollThrottleTimeout);
        window._infiniteScrollThrottleTimeout = null;
    }
}

/**
 * Loads more results for infinite scroll.
 */
async function loadMoreResults() {
    // Double-check to prevent duplicate loads
    if (isLoadingMore || !hasMoreResults || !currentQuery) {
        return;
    }
    
    // Set loading state immediately to prevent duplicate triggers
    isLoadingMore = true;
    
    // Show loading indicator (will check for duplicates internally)
    addInfiniteScrollLoading();
    
    try {
        // Load next page
        const nextPage = currentPage + 1;
        await handleSearch(nextPage, currentQuery, true);
        
        // Note: isLoadingMore will be reset in displayResults() after successful load
        // If no more results, hasMoreResults will be set to false
    } catch (error) {
        console.error('Error loading more results:', error);
        // Remove loading indicator on error
        removeInfiniteScrollLoading();
        isLoadingMore = false;
        
        // Show error message to user (optional, can be removed if too intrusive)
        // await alert('加载更多失败，请稍后重试', '加载错误');
    }
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

