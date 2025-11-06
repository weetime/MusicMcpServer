/**
 * Main Application Entry Point
 * Initializes the application and sets up event listeners.
 */

import { dom } from './dom.js';
import { handleSearch } from './search.js';
import { 
    showSearchHistory, 
    hideSearchHistory, 
    clearSearchHistory,
    handleSearchInput,
    renderSearchHistory
} from './history.js';
import { 
    togglePlayPause, 
    handleProgressChange, 
    handleVolumeChange,
    updateProgress,
    updateDuration,
    handleTrackEnd,
    handleAudioError,
    closePlayerPanel,
    playPreviousTrack,
    playNextTrack,
    updateVolumeIcon
} from './player.js';
import { togglePlaylist, renderPlaylist } from './playlist.js';

/**
 * Initializes the application.
 */
function init() {
    // Event listeners.
    dom.searchBtn.addEventListener('click', handleSearch);
    dom.songInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            hideSearchHistory();
            handleSearch();
        }
    });
    dom.artistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            hideSearchHistory();
            handleSearch();
        }
    });
    
    // Search history events.
    dom.songInput.addEventListener('focus', showSearchHistory);
    dom.songInput.addEventListener('input', handleSearchInput);
    dom.clearHistoryBtn.addEventListener('click', clearSearchHistory);
    
    // Hide search history when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar-wrapper')) {
            hideSearchHistory();
        }
    });
    
    dom.closePlayer.addEventListener('click', closePlayerPanel);
    dom.playPauseBtn.addEventListener('click', togglePlayPause);
    dom.progressBar.addEventListener('input', handleProgressChange);
    dom.volumeBar.addEventListener('input', handleVolumeChange);
    
    // Previous and Next button events.
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', async () => {
            await playPreviousTrack();
            renderPlaylist();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', async () => {
            await playNextTrack();
            renderPlaylist();
        });
    }
    
    // Queue/Playlist button events.
    dom.queueBtn.addEventListener('click', togglePlaylist);
    
    // Hide playlist when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.player-right')) {
            dom.playlistDropdown.classList.add('hidden');
        }
    });
    
    // Audio player events.
    dom.audioPlayer.addEventListener('timeupdate', updateProgress);
    dom.audioPlayer.addEventListener('loadedmetadata', updateDuration);
    dom.audioPlayer.addEventListener('ended', async () => {
        await handleTrackEnd();
        renderPlaylist();
    });
    dom.audioPlayer.addEventListener('error', handleAudioError);
    
    // Set initial volume.
    const initialVolume = dom.volumeBar.value / 100;
    dom.audioPlayer.volume = initialVolume;
    updateVolumeIcon(initialVolume);
    
    // Load and display search history.
    renderSearchHistory();
}

// Initialize on page load.
document.addEventListener('DOMContentLoaded', init);

