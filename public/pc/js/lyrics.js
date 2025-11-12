/**
 * Lyrics Module
 * Handles lyrics display and synchronization with audio playback.
 */

import { dom } from './dom.js';
import { escapeHtml } from './utils.js';

// Lyrics data structure.
let lyricsData = null; // Parsed lyrics array: [{ time: number, text: string, ttext: string }]
let currentLyricIndex = -1;

/**
 * Parses LRC format lyrics string.
 * @param {string} lrcText - LRC format lyrics text.
 * @returns {Array} Parsed lyrics array with time and text.
 */
function parseLRC(lrcText) {
    if (!lrcText) return [];
    
    const lines = lrcText.split('\n');
    const lyrics = [];
    
    // Regex to match time tags: [mm:ss.xx] or [mm:ss]
    const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        
        // Extract all time tags from the line.
        const timeMatches = [];
        let match;
        while ((match = timeRegex.exec(trimmed)) !== null) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
            const time = minutes * 60 + seconds + milliseconds / 1000;
            timeMatches.push(time);
        }
        
        // Extract text (everything after the last time tag).
        const textMatch = trimmed.match(/\]\s*(.+)$/);
        const text = textMatch ? textMatch[1].trim() : '';
        
        // Create entry for each time tag.
        if (timeMatches.length > 0 && text) {
            timeMatches.forEach(time => {
                lyrics.push({ time, text });
            });
        }
    });
    
    // Sort by time.
    lyrics.sort((a, b) => a.time - b.time);
    
    return lyrics;
}

/**
 * Merges original lyrics with translated lyrics.
 * @param {Array} originalLyrics - Original lyrics array.
 * @param {Array} translatedLyrics - Translated lyrics array.
 * @returns {Array} Merged lyrics array.
 */
function mergeLyrics(originalLyrics, translatedLyrics) {
    if (!translatedLyrics || translatedLyrics.length === 0) {
        return originalLyrics;
    }
    
    // Create a map of translated lyrics by time.
    const translatedMap = new Map();
    translatedLyrics.forEach(item => {
        translatedMap.set(item.time, item.text);
    });
    
    // Merge with original lyrics.
    return originalLyrics.map(item => ({
        time: item.time,
        text: item.text,
        ttext: translatedMap.get(item.time) || ''
    }));
}

/**
 * Fetches lyrics for a song.
 * @param {string|number} songId - Song ID.
 * @returns {Promise<Array|null>} Parsed lyrics array or null.
 */
export async function fetchLyrics(songId) {
    if (!songId) return null;
    
    try {
        const response = await fetch(`/api/lyric/${songId}`);
        const data = await response.json();
        
        if (!data.success || !data.lyric) {
            return null;
        }
        
        const { lyric, tlyric } = data.lyric;
        
        // Parse original lyrics.
        const originalLyrics = parseLRC(lyric);
        if (originalLyrics.length === 0) {
            return null;
        }
        
        // Parse translated lyrics if available.
        const translatedLyrics = tlyric ? parseLRC(tlyric) : [];
        
        // Merge lyrics.
        lyricsData = mergeLyrics(originalLyrics, translatedLyrics);
        currentLyricIndex = -1;
        
        // Render lyrics if panel is visible.
        if (dom.lyricsPanel && !dom.lyricsPanel.classList.contains('hidden')) {
            renderLyrics();
        }
        
        return lyricsData;
    } catch (error) {
        console.error('Failed to fetch lyrics:', error);
        return null;
    }
}

/**
 * Updates lyrics display based on current playback time.
 * @param {number} currentTime - Current playback time in seconds.
 */
export function updateLyrics(currentTime) {
    if (!lyricsData || lyricsData.length === 0) return;
    
    // Find the current lyric index.
    let newIndex = -1;
    for (let i = lyricsData.length - 1; i >= 0; i--) {
        if (currentTime >= lyricsData[i].time) {
            newIndex = i;
            break;
        }
    }
    
    // Update if index changed.
    if (newIndex !== currentLyricIndex) {
        currentLyricIndex = newIndex;
        renderLyrics();
    }
}

/**
 * Renders lyrics to the DOM.
 */
function renderLyrics() {
    if (!dom.lyricsContainer) return;
    
    if (!lyricsData || lyricsData.length === 0) {
        dom.lyricsContainer.innerHTML = '<div class="lyrics-empty">暂无歌词</div>';
        return;
    }
    
    // Create lyrics HTML.
    const lyricsHTML = lyricsData.map((item, index) => {
        const isActive = index === currentLyricIndex;
        const activeClass = isActive ? 'active' : '';
        const ttextHTML = item.ttext ? `<div class="lyric-translation">${escapeHtml(item.ttext)}</div>` : '';
        
        return `
            <div class="lyric-line ${activeClass}" data-index="${index}">
                <div class="lyric-text">${escapeHtml(item.text)}</div>
                ${ttextHTML}
            </div>
        `;
    }).join('');
    
    dom.lyricsContainer.innerHTML = lyricsHTML;
    
    // Scroll to active line.
    if (currentLyricIndex >= 0) {
        scrollToActiveLine();
    }
}

/**
 * Scrolls to the active lyric line.
 */
function scrollToActiveLine() {
    if (!dom.lyricsContainer || currentLyricIndex < 0) return;
    
    const activeLine = dom.lyricsContainer.querySelector(`.lyric-line[data-index="${currentLyricIndex}"]`);
    if (activeLine) {
        activeLine.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}


/**
 * Clears lyrics display.
 */
export function clearLyrics() {
    lyricsData = null;
    currentLyricIndex = -1;
    if (dom.lyricsContainer) {
        dom.lyricsContainer.innerHTML = '<div class="lyrics-empty">暂无歌词</div>';
    }
}

/**
 * Shows lyrics panel.
 */
export function showLyrics() {
    if (dom.lyricsPanel) {
        dom.lyricsPanel.classList.remove('hidden');
    }
}

/**
 * Hides lyrics panel.
 */
export function hideLyrics() {
    if (dom.lyricsPanel) {
        dom.lyricsPanel.classList.add('hidden');
    }
}

/**
 * Toggles lyrics panel visibility.
 */
export function toggleLyrics() {
    if (dom.lyricsPanel) {
        const isHidden = dom.lyricsPanel.classList.contains('hidden');
        dom.lyricsPanel.classList.toggle('hidden');
        
        // If showing panel and lyrics are loaded, render them.
        if (isHidden && lyricsData && lyricsData.length > 0) {
            renderLyrics();
        }
    }
}

