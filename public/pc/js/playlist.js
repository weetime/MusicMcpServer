/**
 * Playlist Module
 * Manages playlist functionality.
 */

import { dom } from './dom.js';
import { playlist, currentTrackIndex, setCurrentTrackIndex, setCurrentTrack, setIsPlaying } from './state.js';
import { playTrack, updatePlayPauseIcon } from './player.js';

/**
 * Renders the playlist dropdown.
 */
export function renderPlaylist() {
    dom.playlistList.innerHTML = '';
    
    if (playlist.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'playlist-empty';
        empty.textContent = '播放列表为空';
        dom.playlistList.appendChild(empty);
        dom.playlistCount.textContent = '0 首';
        return;
    }
    
    dom.playlistCount.textContent = `${playlist.length} 首`;
    
    playlist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        if (index === currentTrackIndex) {
            item.classList.add('active');
        }
        
        const albumArt = document.createElement('img');
        albumArt.className = 'playlist-item-art';
        albumArt.src = track.album.images[0]?.url || 'https://via.placeholder.com/50';
        albumArt.alt = track.name;
        
        const info = document.createElement('div');
        info.className = 'playlist-item-info';
        
        const name = document.createElement('div');
        name.className = 'playlist-item-name';
        name.textContent = track.name;
        
        const artist = document.createElement('div');
        artist.className = 'playlist-item-artist';
        artist.textContent = track.artists.map(a => a.name).join(', ');
        
        info.appendChild(name);
        info.appendChild(artist);
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'playlist-item-delete';
        deleteBtn.setAttribute('title', '删除');
        deleteBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteFromPlaylist(index);
        };
        
        item.appendChild(albumArt);
        item.appendChild(info);
        item.appendChild(deleteBtn);
        
        item.onclick = async () => {
            await playTrack(track);
            renderPlaylist();
        };
        
        dom.playlistList.appendChild(item);
    });
}

/**
 * Toggles the playlist dropdown.
 */
export function togglePlaylist() {
    dom.playlistDropdown.classList.toggle('hidden');
    if (!dom.playlistDropdown.classList.contains('hidden')) {
        renderPlaylist();
    }
}

/**
 * Deletes a track from the playlist.
 * @param {number} index - Index of the track to delete.
 */
export async function deleteFromPlaylist(index) {
    if (index < 0 || index >= playlist.length) return;
    
    // If deleting the currently playing track, stop playback
    if (index === currentTrackIndex) {
        dom.audioPlayer.pause();
        dom.audioPlayer.src = '';
        setIsPlaying(false);
        updatePlayPauseIcon();
        setCurrentTrack(null);
        
        // If there are more tracks, play the next one (or previous if at end)
        if (playlist.length > 1) {
            let newIndex;
            if (index < playlist.length - 1) {
                // Play the next track (which will now be at the same index)
                newIndex = index;
            } else {
                // Play the previous track (now at index - 1)
                newIndex = index - 1;
            }
            setCurrentTrackIndex(newIndex);
            const nextTrack = playlist[newIndex];
            if (nextTrack) {
                await playTrack(nextTrack);
                renderPlaylist();
            }
        } else {
            // No more tracks, hide player
            setCurrentTrackIndex(-1);
            dom.musicPlayer.classList.add('hidden');
        }
    } else if (index < currentTrackIndex) {
        // If deleting a track before the current one, adjust current index
        setCurrentTrackIndex(currentTrackIndex - 1);
    }
    
    // Remove track from playlist
    playlist.splice(index, 1);
    
    // Update playlist display
    renderPlaylist();
}

