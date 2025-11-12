/**
 * Main Application Entry Point
 * Initializes the application and sets up event listeners.
 */

import { dom } from './dom.js';
import { handleSearch, setArtistInputModified } from './search.js';
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
    updateVolumeIcon,
    toggleShuffle,
    toggleRepeat
} from './player.js';
import { togglePlaylist, renderPlaylist } from './playlist.js';
import { toggleLyrics } from './lyrics.js';
import { goToPreviousPage, goToNextPage } from './results.js';
import { initThemeUI } from './ui-theme.js';
import { renderInstruments, toggleInstrumentsDropdown, hideInstrumentsDropdown } from './instruments.js';
import { initResponsive } from './responsive.js';

/**
 * Initializes the application.
 */
function init() {
    // Initialize responsive utilities first (for dynamic height calculations).
    initResponsive();
    
    // Initialize theme system.
    initThemeUI();
    
    // Initialize instruments channel dropdown.
    if (dom.instrumentsContent) {
        renderInstruments(dom.instrumentsContent).catch(err => {
            console.error('Error initializing instruments:', err);
        });
    }
    
    // Instruments channel button event.
    if (dom.instrumentsBtn) {
        dom.instrumentsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleInstrumentsDropdown();
            // Update aria-expanded attribute.
            const isExpanded = !dom.instrumentsDropdown.classList.contains('hidden');
            dom.instrumentsBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Keyboard support for instruments button.
        dom.instrumentsBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                dom.instrumentsBtn.click();
            }
        });
    }
    
    // Hide instruments dropdown when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.instruments-selector')) {
            hideInstrumentsDropdown();
        }
    });
    
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
    
    // Track artist input modifications.
    dom.artistInput.addEventListener('input', () => {
        // Mark as modified if user has entered something, otherwise clear the flag.
        const hasValue = dom.artistInput.value.trim().length > 0;
        setArtistInputModified(hasValue);
    });
    
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
    
    // Shuffle and Repeat button events.
    if (dom.shuffleBtn) {
        dom.shuffleBtn.addEventListener('click', toggleShuffle);
    }
    if (dom.repeatBtn) {
        dom.repeatBtn.addEventListener('click', toggleRepeat);
    }
    
    // Queue/Playlist button events.
    dom.queueBtn.addEventListener('click', togglePlaylist);
    
    // Results pagination button events.
    if (dom.prevPageBtn) {
        dom.prevPageBtn.addEventListener('click', goToPreviousPage);
    }
    if (dom.nextPageBtn) {
        dom.nextPageBtn.addEventListener('click', goToNextPage);
    }
    
    // Lyrics button events.
    if (dom.lyricsBtn) {
        dom.lyricsBtn.addEventListener('click', toggleLyrics);
    }
    if (dom.lyricsCloseBtn) {
        dom.lyricsCloseBtn.addEventListener('click', toggleLyrics);
    }
    
    // Hide playlist when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.player-right')) {
            dom.playlistDropdown.classList.add('hidden');
        }
    });
    
    // Hide lyrics panel when clicking outside (on backdrop).
    if (dom.lyricsPanel) {
        dom.lyricsPanel.addEventListener('click', (e) => {
            if (e.target === dom.lyricsPanel) {
                toggleLyrics();
            }
        });
    }
    
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

