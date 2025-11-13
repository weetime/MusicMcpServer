/**
 * Player Module
 * Handles music playback and player controls.
 */

import { dom } from './dom.js';
import { 
    currentTrack, 
    currentTrackIndex, 
    playlist, 
    isPlaying,
    isShuffle,
    repeatMode,
    setCurrentTrack,
    setCurrentTrackIndex,
    setIsPlaying,
    setIsShuffle,
    setRepeatMode
} from './state.js';
import { qualityNames } from './state.js';
import { formatTime } from './utils.js';
import { fetchLyrics, updateLyrics, clearLyrics, renderFullscreenLyrics } from './lyrics.js';
import { alert } from './modal.js';
import { getPlayPauseIcon } from './player-icons.js';

/**
 * Updates search results padding based on player visibility.
 */
function updateSearchResultsPadding() {
    const searchResults = document.querySelector('.search-results');
    const musicPlayer = document.querySelector('.music-player-bar');
    
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
 * Updates fullscreen player UI with current track information.
 * @param {Object} track - Track object.
 */
function updateFullscreenPlayerUI(track) {
    if (!dom.fullscreenPlayer) return;
    
    const albumArtUrl = track.album.images[0]?.url || 'https://via.placeholder.com/400';
    const trackName = track.name;
    const artistName = track.artists.map(a => a.name).join(', ');
    const quality = dom.qualitySelect.value;
    const qualityLabel = qualityNames[quality] || 'Standard';
    
    // Update album art.
    if (dom.fullscreenAlbumArt) {
        dom.fullscreenAlbumArt.src = albumArtUrl;
        dom.fullscreenAlbumArt.alt = trackName;
    }
    
    // Update overlay text.
    if (dom.fullscreenSongTitleOverlay) {
        dom.fullscreenSongTitleOverlay.textContent = trackName;
    }
    if (dom.fullscreenArtistOverlay) {
        dom.fullscreenArtistOverlay.textContent = `/ ${artistName}`;
    }
    
    // Update track info.
    if (dom.fullscreenTrackName) {
        dom.fullscreenTrackName.textContent = trackName;
    }
    if (dom.fullscreenTrackArtist) {
        dom.fullscreenTrackArtist.textContent = artistName;
    }
    
    // Update quality label.
    if (dom.fullscreenQualityLabel) {
        // Map quality to Chinese label.
        const qualityMap = {
            'standard': '标准',
            'higher': '较高',
            'exhigh': '极高',
            'lossless': '无损',
            'hires': 'Hi-Res'
        };
        dom.fullscreenQualityLabel.textContent = qualityMap[quality] || '标准';
    }
}

/**
 * Opens the fullscreen player.
 */
export function openFullscreenPlayer() {
    if (!dom.fullscreenPlayer || !currentTrack) return;
    
    // Update fullscreen player UI.
    updateFullscreenPlayerUI(currentTrack);
    
    // Show fullscreen player.
    dom.fullscreenPlayer.classList.remove('hidden');
    // Use requestAnimationFrame to ensure the element is visible before adding active class.
    requestAnimationFrame(() => {
        dom.fullscreenPlayer.classList.add('active');
    });
    
    // Prevent body scroll when fullscreen player is open.
    document.body.style.overflow = 'hidden';
    
    // Hide bottom navigation and player bar when fullscreen player is open.
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        bottomNav.style.display = 'none';
    }
    if (dom.musicPlayer) {
        dom.musicPlayer.style.display = 'none';
    }
    
    // Render lyrics in fullscreen player if available.
    renderFullscreenLyrics();
}

/**
 * Closes the fullscreen player.
 */
export function closeFullscreenPlayer() {
    if (!dom.fullscreenPlayer) return;
    
    // Remove active class first for transition.
    dom.fullscreenPlayer.classList.remove('active');
    
    // Hide after transition.
    setTimeout(() => {
        dom.fullscreenPlayer.classList.add('hidden');
        // Restore body scroll.
        document.body.style.overflow = '';
        
        // Show bottom navigation and player bar again.
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) {
            bottomNav.style.display = '';
        }
        if (dom.musicPlayer && !dom.musicPlayer.classList.contains('hidden')) {
            dom.musicPlayer.style.display = '';
        }
    }, 300);
}

/**
 * Plays the selected track.
 * Handles Netease tracks (fetch URL via API).
 * @param {Object} track - Track object to play.
 */
export async function playTrack(track) {
    if (!track.preview_url) {
        await alert('Sorry, this song has no preview audio available.\n\nUnable to get playback URL.', '播放失败');
        return;
    }
    
    // Find track index in playlist.
    let trackIndex = playlist.findIndex(t => t.id === track.id);
    if (trackIndex === -1) {
        // If track not found in playlist, add it and set index.
        playlist.push(track);
        trackIndex = playlist.length - 1;
    }
    
    setCurrentTrackIndex(trackIndex);
    setCurrentTrack(track);
    
    // Update player UI using safe DOM properties.
    dom.albumArt.src = track.album.images[0]?.url || 'https://via.placeholder.com/56';
    dom.albumArt.alt = track.name;
    dom.trackName.textContent = track.name;
    dom.trackArtist.textContent = track.artists.map(a => a.name).join(', ');
    
    // Update fullscreen player UI if it exists.
    updateFullscreenPlayerUI(track);
    
    // Show fixed bottom player.
    dom.musicPlayer.classList.remove('hidden');
    // Update search results padding when player is shown
    updateSearchResultsPadding();
    
    try {
        // All tracks are Netease tracks (preview_url format: "netease:SONG_ID").
        if (!track.preview_url.startsWith('netease:')) {
            await alert('Invalid track format. Expected Netease track.', '播放错误');
            return;
        }
        
        const songId = track.preview_url.replace('netease:', '');
        
        // Get selected quality level.
        const quality = dom.qualitySelect.value;
        
        // Fetch the actual playback URL from API with selected quality.
        const response = await fetch(`/api/song-url/${songId}?level=${quality}`);
        const data = await response.json();
        
        if (!data.success || !data.url) {
            await alert('Sorry, this song has no available audio.\n\nMay be due to copyright restrictions or the song has been removed.\nYou can try switching to a lower quality level.', '播放失败');
            return;
        }
        
        // Load and play audio.
        dom.audioPlayer.src = data.url;
        dom.audioPlayer.load();
        dom.audioPlayer.play();
        
        setIsPlaying(true);
        updatePlayPauseIcon();
        
        // Update shuffle and repeat button states
        updateShuffleButton();
        updateRepeatButton();
        
        // Fetch lyrics for Netease tracks.
        await fetchLyrics(songId);
    } catch (error) {
        console.error('Playback error:', error);
        await alert('Playback failed. Please try again later.\n\n' + error.message, '播放错误');
    }
}

/**
 * Toggles play/pause state.
 */
export function togglePlayPause() {
    if (!currentTrack) return;
    
    if (isPlaying) {
        dom.audioPlayer.pause();
        setIsPlaying(false);
    } else {
        dom.audioPlayer.play();
        setIsPlaying(true);
    }
    
    updatePlayPauseIcon();
}

/**
 * Updates play/pause button icon.
 */
export function updatePlayPauseIcon() {
    // Update player bar icon (20x20).
    dom.playPauseIcon.innerHTML = getPlayPauseIcon(isPlaying, 20);
    
    // Update fullscreen player play/pause icon if it exists (32x32).
    if (dom.fullscreenPlayPauseIcon) {
        dom.fullscreenPlayPauseIcon.innerHTML = getPlayPauseIcon(isPlaying, 32);
    }
}

/**
 * Handles progress bar change.
 */
export function handleProgressChange() {
    if (!dom.progressBar) return;
    const time = (dom.progressBar.value / 100) * dom.audioPlayer.duration;
    dom.audioPlayer.currentTime = time;
}

/**
 * Handles fullscreen player progress bar change.
 */
export function handleFullscreenProgressChange() {
    if (!dom.fullscreenProgressBar) return;
    const time = (dom.fullscreenProgressBar.value / 100) * dom.audioPlayer.duration;
    dom.audioPlayer.currentTime = time;
    
    // Sync with regular progress bar.
    if (dom.progressBar) {
        dom.progressBar.value = dom.fullscreenProgressBar.value;
    }
}

/**
 * Handles volume bar change.
 */
export function handleVolumeChange() {
    if (!dom.volumeBar) return; // Mobile may not have volume control.
    const volume = dom.volumeBar.value / 100;
    dom.audioPlayer.volume = volume;
    updateVolumeIcon(volume);
}

/**
 * Updates volume icon based on volume level.
 * @param {number} volume - Volume level (0-1).
 */
export function updateVolumeIcon(volume) {
    const volumeIcon = document.getElementById('volumeIcon');
    if (!volumeIcon) return;
    
    // Clear existing paths
    volumeIcon.innerHTML = '';
    
    if (volume === 0) {
        // Muted icon
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
        `;
    } else if (volume < 0.5) {
        // Low volume icon
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
    } else {
        // High volume icon
        volumeIcon.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        `;
    }
}

/**
 * Updates progress bar and current time display.
 */
export function updateProgress() {
    if (dom.audioPlayer.duration) {
        const progress = (dom.audioPlayer.currentTime / dom.audioPlayer.duration) * 100;
        
        // Update progress bar if it exists (may not exist in mobile player bar).
        if (dom.progressBar) {
            dom.progressBar.value = progress;
        }
        if (dom.currentTime) {
            dom.currentTime.textContent = formatTime(dom.audioPlayer.currentTime);
        }
        
        // Update fullscreen player progress if it exists.
        if (dom.fullscreenProgressBar) {
            dom.fullscreenProgressBar.value = progress;
        }
        if (dom.fullscreenCurrentTime) {
            dom.fullscreenCurrentTime.textContent = formatTime(dom.audioPlayer.currentTime);
        }
        
        // Update lyrics synchronization.
        updateLyrics(dom.audioPlayer.currentTime);
    }
}

/**
 * Updates duration display.
 */
export function updateDuration() {
    if (dom.audioPlayer.duration) {
        dom.duration.textContent = formatTime(dom.audioPlayer.duration);
        
        // Update fullscreen player duration if it exists.
        if (dom.fullscreenDuration) {
            dom.fullscreenDuration.textContent = formatTime(dom.audioPlayer.duration);
        }
    }
}

/**
 * Handles track end.
 * Automatically plays next track based on repeat mode.
 */
export async function handleTrackEnd() {
    setIsPlaying(false);
    updatePlayPauseIcon();
    if (dom.progressBar) {
        dom.progressBar.value = 0;
    }
    if (dom.currentTime) {
        dom.currentTime.textContent = '0:00';
    }
    if (dom.fullscreenProgressBar) {
        dom.fullscreenProgressBar.value = 0;
    }
    if (dom.fullscreenCurrentTime) {
        dom.fullscreenCurrentTime.textContent = '0:00';
    }
    
    // Handle repeat one mode - replay current track.
    if (repeatMode === 'one') {
        if (currentTrack) {
            await playTrack(currentTrack);
        }
        return;
    }
    
    // Auto-play next track if available.
    if (playlist.length > 0 && currentTrackIndex >= 0) {
        await playNextTrack();
        // Note: renderPlaylist will be called by the caller if needed
    }
}

/**
 * Handles audio loading errors.
 */
export async function handleAudioError() {
    console.error('Audio playback error');
    await alert('Audio loading failed. Please try another song.', '播放错误');
    setIsPlaying(false);
    updatePlayPauseIcon();
}

/**
 * Closes the player panel.
 */
export function closePlayerPanel() {
    // Note: Mobile version doesn't have a close button, but this function is kept for compatibility.
    dom.audioPlayer.pause();
    dom.audioPlayer.src = '';
    if (dom.musicPlayer) {
        dom.musicPlayer.classList.add('hidden');
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTrackIndex(-1);
    
    // Update search results padding when player is hidden
    updateSearchResultsPadding();
    
    // Clear lyrics when closing player.
    clearLyrics();
}

/**
 * Plays the previous track in the playlist.
 */
export async function playPreviousTrack() {
    if (playlist.length === 0) return;
    
    let newIndex;
    
    if (isShuffle) {
        // Shuffle mode: play random track
        newIndex = Math.floor(Math.random() * playlist.length);
    } else {
        // Normal mode: play previous track
        if (currentTrackIndex <= 0) {
            // If at the beginning, check repeat mode
            if (repeatMode === 'all') {
                newIndex = playlist.length - 1;
            } else {
                // If repeat is off, stay at first track
                return;
            }
        } else {
            newIndex = currentTrackIndex - 1;
        }
    }
    
    setCurrentTrackIndex(newIndex);
    const track = playlist[newIndex];
    if (track) {
        await playTrack(track);
    }
}

/**
 * Plays the next track in the playlist.
 */
export async function playNextTrack() {
    if (playlist.length === 0) return;
    
    let newIndex;
    
    if (isShuffle) {
        // Shuffle mode: play random track (avoid same track if possible)
        if (playlist.length === 1) {
            newIndex = 0;
        } else {
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
        }
    } else {
        // Normal mode: play next track
        if (currentTrackIndex >= playlist.length - 1) {
            // If at the end, check repeat mode
            if (repeatMode === 'all') {
                newIndex = 0;
            } else {
                // If repeat is off, stop at last track
                setIsPlaying(false);
                updatePlayPauseIcon();
                return;
            }
        } else {
            newIndex = currentTrackIndex + 1;
        }
    }
    
    setCurrentTrackIndex(newIndex);
    const track = playlist[newIndex];
    if (track) {
        await playTrack(track);
    }
}

/**
 * Toggles shuffle mode.
 */
export function toggleShuffle() {
    setIsShuffle(!isShuffle);
    updateShuffleButton();
}

/**
 * Toggles repeat mode.
 * Cycles through: off -> all -> one -> off
 */
export function toggleRepeat() {
    if (repeatMode === 'off') {
        setRepeatMode('all');
    } else if (repeatMode === 'all') {
        setRepeatMode('one');
    } else {
        setRepeatMode('off');
    }
    updateRepeatButton();
}

/**
 * Updates shuffle button visual state.
 */
function updateShuffleButton() {
    if (dom.shuffleBtn) {
        if (isShuffle) {
            dom.shuffleBtn.classList.add('active');
            dom.shuffleBtn.style.color = 'var(--accent-primary)';
        } else {
            dom.shuffleBtn.classList.remove('active');
            dom.shuffleBtn.style.color = '';
        }
    }
    
    // Update fullscreen player shuffle button if it exists.
    if (dom.fullscreenShuffleBtn) {
        if (isShuffle) {
            dom.fullscreenShuffleBtn.classList.add('active');
            dom.fullscreenShuffleBtn.style.color = 'var(--accent-primary)';
        } else {
            dom.fullscreenShuffleBtn.classList.remove('active');
            dom.fullscreenShuffleBtn.style.color = '';
        }
    }
}

/**
 * Updates repeat button visual state.
 */
function updateRepeatButton() {
    if (!dom.repeatBtn) return;
    
    const repeatIcon = document.getElementById('repeatIcon');
    if (!repeatIcon) return;
    
    // Remove all state classes
    dom.repeatBtn.classList.remove('repeat-off', 'repeat-all', 'repeat-one');
    
    // Update SVG icon and color based on mode
    if (repeatMode === 'off') {
        dom.repeatBtn.classList.add('repeat-off');
        dom.repeatBtn.style.color = '';
        repeatIcon.innerHTML = `
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        `;
        dom.repeatBtn.title = 'Repeat Off';
    } else if (repeatMode === 'all') {
        dom.repeatBtn.classList.add('repeat-all');
        dom.repeatBtn.style.color = 'var(--accent-primary)';
        repeatIcon.innerHTML = `
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        `;
        dom.repeatBtn.title = 'Repeat All';
    } else if (repeatMode === 'one') {
        dom.repeatBtn.classList.add('repeat-one');
        dom.repeatBtn.style.color = 'var(--accent-primary)';
        // Repeat one icon: add a "1" indicator
        repeatIcon.innerHTML = `
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8"></circle>
        `;
        dom.repeatBtn.title = 'Repeat One';
    }
}

