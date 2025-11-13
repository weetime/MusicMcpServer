/**
 * Instrument SVG Icons Module
 * Loads SVG icons from separate files in icons/instruments/ folder.
 */

// Icon file path mapping.
// Note: Paths use /web prefix since server maps '/web' to 'public/pc'
const iconPaths = {
    Erhu: '/web/icons/instruments/erhu.svg',
    Guzheng: '/web/icons/instruments/guzheng.svg',
    Pipa: '/web/icons/instruments/pipa.svg',
    Dizi: '/web/icons/instruments/dizi.svg',
    Suona: '/web/icons/instruments/suona.svg',
    Hulusi: '/web/icons/instruments/hulusi.svg',
    Ocarina: '/web/icons/instruments/ocarina.svg',
    Violin: '/web/icons/instruments/violin.svg',
    Guitar: '/web/icons/instruments/guitar.svg',
    Piano: '/web/icons/instruments/piano.svg'
};

// Cache for loaded SVG content.
const iconCache = new Map();

/**
 * Loads SVG icon from file.
 * @param {string} instrumentName - Name of the instrument.
 * @returns {Promise<string>} SVG icon HTML string.
 */
async function loadIcon(instrumentName) {
    const path = iconPaths[instrumentName] || iconPaths.Guitar;
    
    // Return cached icon if available.
    if (iconCache.has(path)) {
        return iconCache.get(path);
    }
    
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load icon: ${path}`);
        }
        const svgContent = await response.text();
        iconCache.set(path, svgContent);
        return svgContent;
    } catch (error) {
        console.error(`Error loading icon ${path}:`, error);
        // Return fallback icon.
        return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`;
    }
}

/**
 * Gets SVG icon for an instrument (synchronous version using cached icons).
 * @param {string} instrumentName - Name of the instrument.
 * @returns {string} SVG icon HTML string.
 */
export function getInstrumentIcon(instrumentName) {
    const path = iconPaths[instrumentName] || iconPaths.Guitar;
    
    // Return cached icon if available.
    if (iconCache.has(path)) {
        return iconCache.get(path);
    }
    
    // Return placeholder if not cached yet (will be replaced when loaded).
    return `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/></svg>`;
}

/**
 * Preloads all instrument icons.
 * @returns {Promise<void>}
 */
export async function preloadIcons() {
    try {
        const loadPromises = Object.keys(iconPaths).map(name => 
            loadIcon(name).catch(err => {
                console.warn(`Failed to load icon for ${name}:`, err);
                return null; // Continue even if one icon fails
            })
        );
        await Promise.all(loadPromises);
    } catch (error) {
        console.warn('Error during icon preload:', error);
        // Don't throw, allow rendering to continue with fallback icons
    }
}


