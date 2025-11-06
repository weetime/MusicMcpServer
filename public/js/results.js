/**
 * Results Display Module
 * Handles search results display and rendering.
 */

import { dom } from './dom.js';
import { setPlaylist } from './state.js';
import { playTrack } from './player.js';
import { renderPlaylist } from './playlist.js';
import { hideLoading } from './ui.js';

/**
 * Displays search results.
 * @param {Array} tracks - Array of track objects.
 */
export function displayResults(tracks) {
    hideLoading();
    
    dom.resultsList.innerHTML = '';
    
    // Update playlist with new search results.
    setPlaylist(tracks);
    
    // Update results count.
    if (dom.resultsCount) {
        dom.resultsCount.textContent = `${tracks.length} result${tracks.length !== 1 ? 's' : ''}`;
    }
    
    tracks.forEach((track, index) => {
        const resultItem = createResultItem(track, index);
        dom.resultsList.appendChild(resultItem);
    });
    
    dom.searchResults.classList.remove('hidden');
    
    // Update playlist display.
    renderPlaylist();
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

