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
    setCurrentTrack,
    setCurrentTrackIndex,
    setIsPlaying
} from './state.js';
import { qualityNames } from './state.js';
import { formatTime } from './utils.js';

/**
 * Plays the selected track.
 * Handles both Spotify (direct URL) and Netease (fetch URL via API) tracks.
 * @param {Object} track - Track object to play.
 */
export async function playTrack(track) {
    if (!track.preview_url) {
        alert('Sorry, this song has no preview audio available.\n\nUnable to get playback URL.');
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
    
    // Show fixed bottom player.
    dom.musicPlayer.classList.remove('hidden');
    
    try {
        let audioUrl;
        
        // Check if this is a Netease track (preview_url starts with "netease:").
        if (track.preview_url.startsWith('netease:')) {
            const songId = track.preview_url.replace('netease:', '');
            
            // Get selected quality level.
            const quality = dom.qualitySelect.value;
            
            // Fetch the actual playback URL from API with selected quality.
            const response = await fetch(`/api/song-url/${songId}?level=${quality}`);
            const data = await response.json();
            
            if (!data.success || !data.url) {
                alert('Sorry, this song has no available audio.\n\nMay be due to copyright restrictions or the song has been removed.\nYou can try switching to a lower quality level.');
                return;
            }
            
            audioUrl = data.url;
            
            // Quality info is no longer displayed in the fixed player.
        } else {
            // Spotify or other source with direct URL.
            audioUrl = track.preview_url;
        }
        
        // Load and play audio.
        dom.audioPlayer.src = audioUrl;
        dom.audioPlayer.load();
        dom.audioPlayer.play();
        
        setIsPlaying(true);
        updatePlayPauseIcon();
    } catch (error) {
        console.error('Playback error:', error);
        alert('Playback failed. Please try again later.\n\n' + error.message);
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
    dom.playPauseIcon.textContent = isPlaying ? '⏸' : '▶';
}

/**
 * Handles progress bar change.
 */
export function handleProgressChange() {
    const time = (dom.progressBar.value / 100) * dom.audioPlayer.duration;
    dom.audioPlayer.currentTime = time;
}

/**
 * Handles volume bar change.
 */
export function handleVolumeChange() {
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
        dom.progressBar.value = progress;
        dom.currentTime.textContent = formatTime(dom.audioPlayer.currentTime);
    }
}

/**
 * Updates duration display.
 */
export function updateDuration() {
    if (dom.audioPlayer.duration) {
        dom.duration.textContent = formatTime(dom.audioPlayer.duration);
    }
}

/**
 * Handles track end.
 * Automatically plays next track if available.
 */
export async function handleTrackEnd() {
    setIsPlaying(false);
    updatePlayPauseIcon();
    dom.progressBar.value = 0;
    dom.currentTime.textContent = '0:00';
    
    // Auto-play next track if available.
    if (playlist.length > 0 && currentTrackIndex >= 0) {
        await playNextTrack();
        // Note: renderPlaylist will be called by the caller if needed
    }
}

/**
 * Handles audio loading errors.
 */
export function handleAudioError() {
    console.error('Audio playback error');
    alert('Audio loading failed. Please try another song.');
    setIsPlaying(false);
    updatePlayPauseIcon();
}

/**
 * Closes the player panel.
 */
export function closePlayerPanel() {
    dom.audioPlayer.pause();
    dom.audioPlayer.src = '';
    dom.musicPlayer.classList.add('hidden');
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTrackIndex(-1);
}

/**
 * Plays the previous track in the playlist.
 */
export async function playPreviousTrack() {
    if (playlist.length === 0) return;
    
    let newIndex;
    if (currentTrackIndex <= 0) {
        // If at the beginning, loop to the end.
        newIndex = playlist.length - 1;
    } else {
        newIndex = currentTrackIndex - 1;
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
    if (currentTrackIndex >= playlist.length - 1) {
        // If at the end, loop to the beginning.
        newIndex = 0;
    } else {
        newIndex = currentTrackIndex + 1;
    }
    
    setCurrentTrackIndex(newIndex);
    const track = playlist[newIndex];
    if (track) {
        await playTrack(track);
    }
}

