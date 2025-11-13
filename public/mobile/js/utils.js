/**
 * Utility Functions Module
 * Provides common utility functions.
 */

/**
 * Formats time in seconds to MM:SS format.
 * @param {number} seconds - Time in seconds.
 * @returns {string} Formatted time string.
 */
export function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Escapes HTML to prevent XSS.
 * @param {string} text - Text to escape.
 * @returns {string} Escaped HTML string.
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Detects if the device is a touch device.
 * @returns {boolean} True if touch device.
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Adds optimized touch/click event listener for mobile devices.
 * Uses touchstart on mobile for instant response, click on desktop.
 * @param {HTMLElement} element - Element to attach event to.
 * @param {Function} handler - Event handler function.
 * @param {Object} options - Optional event options.
 */
export function addTouchOrClick(element, handler, options = {}) {
    if (!element) return;
    
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let hasMoved = false;
    
    if (isTouchDevice()) {
        // Use touch events for mobile devices.
        element.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            hasMoved = false;
            
            // Add active class for visual feedback.
            element.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
                const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                if (deltaX > 10 || deltaY > 10) {
                    hasMoved = true;
                    element.classList.remove('touch-active');
                }
            }
        }, { passive: true });
        
        element.addEventListener('touchend', (e) => {
            element.classList.remove('touch-active');
            
            // Only trigger if touch didn't move significantly.
            if (!hasMoved && Date.now() - touchStartTime < 500) {
                e.preventDefault();
                handler(e);
            }
        }, { passive: false });
        
        // Also handle click as fallback.
        element.addEventListener('click', (e) => {
            // Prevent double-trigger on touch devices.
            if (Date.now() - touchStartTime < 300) {
                e.preventDefault();
                return;
            }
            handler(e);
        });
    } else {
        // Use click for desktop.
        element.addEventListener('click', handler, options);
    }
}

