/**
 * Responsive Utilities Module
 * Handles dynamic height calculations and responsive behavior
 */

/**
 * Updates search results padding based on player visibility
 */
function updateSearchResultsPadding() {
    const searchResults = document.querySelector('.search-results');
    const musicPlayer = document.querySelector('.music-player');
    
    if (searchResults && musicPlayer) {
        const isPlayerHidden = musicPlayer.classList.contains('hidden');
        if (isPlayerHidden) {
            searchResults.classList.add('no-player-padding');
        } else {
            searchResults.classList.remove('no-player-padding');
        }
    }
}

/**
 * Calculates and sets CSS variables for header and search bar heights
 */
export function updateResponsiveHeights() {
    const header = document.querySelector('.fixed-header');
    const searchBar = document.querySelector('.fixed-search-bar');
    
    if (header) {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        
        // Update search bar position
        if (searchBar) {
            searchBar.style.top = `${headerHeight}px`;
        }
        
        // Update search bar height variable
        if (searchBar) {
            const searchBarHeight = searchBar.offsetHeight;
            document.documentElement.style.setProperty('--search-bar-height', `${searchBarHeight}px`);
        }
        
        // Update container padding-top using CSS variables
        const container = document.querySelector('.container');
        if (container && searchBar) {
            const searchBarHeight = searchBar.offsetHeight;
            const totalHeight = headerHeight + searchBarHeight + 20; // 20px extra spacing
            container.style.paddingTop = `${totalHeight}px`;
        }
    }
    
    // Update search results padding based on player visibility
    updateSearchResultsPadding();
}

/**
 * Initializes responsive utilities
 */
export function initResponsive() {
    // Update heights on load
    updateResponsiveHeights();
    
    // Update heights on resize (with debounce)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateResponsiveHeights();
        }, 100);
    });
    
    // Update heights when DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
        updateResponsiveHeights();
    });
    
    const header = document.querySelector('.fixed-header');
    if (header) {
        observer.observe(header, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
    
    // Observe music player visibility changes
    const musicPlayer = document.querySelector('.music-player');
    if (musicPlayer) {
        const playerObserver = new MutationObserver(() => {
            updateSearchResultsPadding();
        });
        
        playerObserver.observe(musicPlayer, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

/**
 * Gets current breakpoint (Mobile version - mobile and tablet only)
 * @returns {string} Current breakpoint name
 */
export function getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width < 480) return 'mobile';
    if (width < 768) return 'small-tablet';
    if (width < 1024) return 'tablet';
    return 'tablet'; // Mobile version doesn't go beyond tablet
}

/**
 * Checks if current viewport matches breakpoint
 * @param {string} breakpoint - Breakpoint name
 * @returns {boolean}
 */
export function isBreakpoint(breakpoint) {
    return getCurrentBreakpoint() === breakpoint;
}

/**
 * Checks if viewport is mobile
 * @returns {boolean}
 */
export function isMobile() {
    return window.innerWidth < 768;
}

/**
 * Checks if viewport is tablet
 * @returns {boolean}
 */
export function isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
}

