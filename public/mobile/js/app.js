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
    playPreviousTrack,
    playNextTrack,
    updateVolumeIcon,
    toggleShuffle,
    toggleRepeat,
    openFullscreenPlayer,
    closeFullscreenPlayer,
    handleFullscreenProgressChange
} from './player.js';
import { togglePlaylist, renderPlaylist } from './playlist.js';
import { toggleLyrics } from './lyrics.js';
// Mobile uses infinite scroll, no pagination functions needed.
import { initThemeUI, toggleThemeDropdown, hideThemeDropdown } from './ui-theme.js';
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
    
    // Helper function to close playlist dropdown.
    function closePlaylistDropdown() {
        if (dom.playlistDropdown) {
            dom.playlistDropdown.classList.add('hidden');
        }
    }
    
    // Bottom navigation events.
    if (dom.navHome) {
        dom.navHome.addEventListener('click', () => {
            // Close playlist when clicking home.
            closePlaylistDropdown();
            // Scroll to top and reset active state.
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveNav('home');
        });
    }
    
    if (dom.navInstruments) {
        dom.navInstruments.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close playlist when clicking instruments.
            closePlaylistDropdown();
            toggleInstrumentsDropdown();
            setActiveNav('instruments');
            // Update aria-expanded attribute.
            const isExpanded = !dom.instrumentsDropdown.classList.contains('hidden');
            dom.navInstruments.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    if (dom.navTheme) {
        dom.navTheme.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close playlist when clicking theme.
            closePlaylistDropdown();
            toggleThemeDropdown();
            setActiveNav('theme');
            // Update aria-expanded attribute.
            const isExpanded = !dom.themeDropdown.classList.contains('hidden');
            dom.navTheme.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Hide instruments dropdown when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.instruments-dropdown') && !e.target.closest('#navInstruments')) {
            hideInstrumentsDropdown();
        }
    });
    
    // Hide theme dropdown when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.theme-dropdown-bottom') && !e.target.closest('#navTheme')) {
            hideThemeDropdown();
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
    
    // Queue/Playlist button in player bar.
    const queueBtn = document.querySelector('.player-bar-queue-btn');
    if (queueBtn) {
        queueBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlaylist();
        });
    }
    
    // Click player bar to open fullscreen player (except buttons).
    if (dom.musicPlayer) {
        dom.musicPlayer.addEventListener('click', (e) => {
            // Don't open fullscreen if clicking on buttons.
            if (e.target.closest('button')) {
                return;
            }
            // Don't open if fullscreen player is already open.
            if (dom.fullscreenPlayer && dom.fullscreenPlayer.classList.contains('active')) {
                return;
            }
            // Open fullscreen player.
            openFullscreenPlayer();
        });
    }
    
    dom.playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent opening fullscreen when clicking play/pause.
        togglePlayPause();
    });
    
    // Progress bar (may not exist in mobile player bar).
    if (dom.progressBar) {
        dom.progressBar.addEventListener('input', handleProgressChange);
    }
    
    // Volume bar (only if exists - mobile may not have it).
    if (dom.volumeBar) {
        dom.volumeBar.addEventListener('input', handleVolumeChange);
    }
    
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
    
    // Shuffle and Repeat button events (only if exists - mobile may not have them).
    if (dom.shuffleBtn) {
        dom.shuffleBtn.addEventListener('click', toggleShuffle);
    }
    if (dom.repeatBtn) {
        dom.repeatBtn.addEventListener('click', toggleRepeat);
    }
    
    // Queue/Playlist button events (only if exists - mobile may not have it).
    if (dom.queueBtn) {
        dom.queueBtn.addEventListener('click', togglePlaylist);
    }
    
    // Mobile uses infinite scroll, no pagination buttons needed.
    
    // Lyrics button events.
    if (dom.lyricsBtn) {
        dom.lyricsBtn.addEventListener('click', toggleLyrics);
    }
    if (dom.lyricsCloseBtn) {
        dom.lyricsCloseBtn.addEventListener('click', toggleLyrics);
    }
    
    // Hide playlist when clicking outside (including bottom nav buttons).
    document.addEventListener('click', (e) => {
        // Close playlist if clicking outside the dropdown and queue button.
        // Also close if clicking on bottom nav buttons.
        const isClickingPlaylist = e.target.closest('.playlist-dropdown-bottom');
        const isClickingQueueBtn = e.target.closest('.player-bar-queue-btn');
        const isClickingBottomNav = e.target.closest('.bottom-nav');
        
        if (!isClickingPlaylist && !isClickingQueueBtn) {
            closePlaylistDropdown();
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
    
    // Fullscreen player events.
    if (dom.fullscreenPlayerBackBtn) {
        dom.fullscreenPlayerBackBtn.addEventListener('click', closeFullscreenPlayer);
    }
    
    // Fullscreen player play/pause button.
    if (dom.fullscreenPlayPauseBtn) {
        dom.fullscreenPlayPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    // Fullscreen player progress bar.
    if (dom.fullscreenProgressBar) {
        dom.fullscreenProgressBar.addEventListener('input', handleFullscreenProgressChange);
    }
    
    // Fullscreen player previous/next buttons.
    if (dom.fullscreenPrevBtn) {
        dom.fullscreenPrevBtn.addEventListener('click', async () => {
            await playPreviousTrack();
            renderPlaylist();
        });
    }
    if (dom.fullscreenNextBtn) {
        dom.fullscreenNextBtn.addEventListener('click', async () => {
            await playNextTrack();
            renderPlaylist();
        });
    }
    
    // Fullscreen player shuffle button.
    if (dom.fullscreenShuffleBtn) {
        dom.fullscreenShuffleBtn.addEventListener('click', toggleShuffle);
    }
    
    // Fullscreen player queue button.
    if (dom.fullscreenQueueBtn) {
        dom.fullscreenQueueBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlaylist();
        });
    }
    
    
    // Close fullscreen player when clicking outside (on backdrop) - removed for better UX.
    // Users should use the back button to close the fullscreen player.
    
    // Audio player events.
    dom.audioPlayer.addEventListener('timeupdate', updateProgress);
    dom.audioPlayer.addEventListener('loadedmetadata', updateDuration);
    dom.audioPlayer.addEventListener('ended', async () => {
        await handleTrackEnd();
        renderPlaylist();
    });
    dom.audioPlayer.addEventListener('error', handleAudioError);
    
    // Set initial volume (only if volume bar exists).
    if (dom.volumeBar) {
        const initialVolume = dom.volumeBar.value / 100;
        dom.audioPlayer.volume = initialVolume;
        updateVolumeIcon(initialVolume);
    } else {
        // Default volume for mobile (no volume control).
        dom.audioPlayer.volume = 0.7;
    }
    
    // Load and display search history.
    renderSearchHistory();
}

/**
 * Sets active navigation item.
 */
function setActiveNav(activeId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    if (activeId === 'home' && dom.navHome) {
        dom.navHome.classList.add('active');
    } else if (activeId === 'instruments' && dom.navInstruments) {
        dom.navInstruments.classList.add('active');
    } else if (activeId === 'theme' && dom.navTheme) {
        dom.navTheme.classList.add('active');
    }
}

// Initialize on page load.
document.addEventListener('DOMContentLoaded', init);

