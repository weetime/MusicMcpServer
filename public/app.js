/**
 * MusicCore Frontend Application
 * Handles music search and playback functionality.
 */

// DOM Elements.
const songInput = document.getElementById('songInput');
const artistInput = document.getElementById('artistInput');
const qualitySelect = document.getElementById('qualitySelect');
const searchBtn = document.getElementById('searchBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const searchResults = document.getElementById('searchResults');
const resultsList = document.getElementById('resultsList');
const resultsCount = document.getElementById('resultsCount');
const musicPlayer = document.getElementById('musicPlayer');
const closePlayer = document.getElementById('closePlayer');
const albumArt = document.getElementById('albumArt');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const searchHistory = document.getElementById('searchHistory');
const searchHistoryList = document.getElementById('searchHistoryList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Application state.
let currentTrack = null;
let isPlaying = false;
const MAX_HISTORY_ITEMS = 10; // Maximum number of search history items to display.

// Quality level mapping for display.
const qualityNames = {
    'standard': 'Standard',
    'higher': 'Higher',
    'exhigh': 'Extremely High',
    'lossless': 'Lossless',
    'hires': 'Hi-Res'
};

/**
 * Initializes the application.
 */
function init() {
    // Event listeners.
    searchBtn.addEventListener('click', handleSearch);
    songInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            hideSearchHistory();
            handleSearch();
        }
    });
    artistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            hideSearchHistory();
            handleSearch();
        }
    });
    
    // Search history events.
    songInput.addEventListener('focus', showSearchHistory);
    songInput.addEventListener('input', handleSearchInput);
    clearHistoryBtn.addEventListener('click', clearSearchHistory);
    
    // Hide search history when clicking outside.
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar-wrapper')) {
            hideSearchHistory();
        }
    });
    
    closePlayer.addEventListener('click', closePlayerPanel);
    playPauseBtn.addEventListener('click', togglePlayPause);
    progressBar.addEventListener('input', handleProgressChange);
    volumeBar.addEventListener('input', handleVolumeChange);
    
    // Audio player events.
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    audioPlayer.addEventListener('ended', handleTrackEnd);
    audioPlayer.addEventListener('error', handleAudioError);
    
    // Set initial volume.
    const initialVolume = volumeBar.value / 100;
    audioPlayer.volume = initialVolume;
    updateVolumeIcon(initialVolume);
    
    // Load and display search history.
    renderSearchHistory();
}

/**
 * Handles search button click.
 * Default music source is Netease Cloud Music for better Chinese song support.
 */
async function handleSearch() {
    const song = songInput.value.trim();
    const artist = artistInput.value.trim();
    
    if (!song) {
        alert('Please enter a song name!');
        return;
    }
    
    // Build search query for Netease (simply combine with space).
    let query = song;
    if (artist) {
        query += ` ${artist}`;
    }
    
    // Save to search history.
    saveSearchHistory(query);
    
    // Hide search history.
    hideSearchHistory();
    
    // Show loading state.
    showLoading();
    hideResults();
    hidePlayer();
    
    try {
        // Search via Netease Cloud Music API.
        const response = await fetch(
            `/api/search?q=${encodeURIComponent(query)}&limit=20`
        );
        
        if (!response.ok) {
            throw new Error('搜索失败，请稍后重试');
        }
        
        const data = await response.json();
        
        if (data.success && data.results.tracks && data.results.tracks.items.length > 0) {
            displayResults(data.results.tracks.items);
        } else {
            alert('No songs found. Please try different keywords.');
            hideLoading();
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('Search error: ' + error.message);
        hideLoading();
    }
}

/**
 * Displays search results.
 */
function displayResults(tracks) {
    hideLoading();
    
    resultsList.innerHTML = '';
    
    // Update results count.
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${tracks.length} result${tracks.length !== 1 ? 's' : ''}`;
    }
    
    tracks.forEach((track, index) => {
        const resultItem = createResultItem(track, index);
        resultsList.appendChild(resultItem);
    });
    
    searchResults.classList.remove('hidden');
}

/**
 * Creates a result card element in the new card style.
 * Uses DOM API instead of innerHTML to prevent XSS vulnerabilities.
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
    
    // Create play button overlay.
    const playButton = document.createElement('button');
    playButton.className = 'play-button';
    playButton.innerHTML = '▶';
    playButton.onclick = (e) => {
        e.stopPropagation();
        playTrack(track);
    };
    
    // Assemble album art wrapper.
    artWrapper.appendChild(img);
    artWrapper.appendChild(playButton);
    
    // Create album title background (with color variation).
    const titleBg = document.createElement('div');
    titleBg.className = `album-title-bg color-${(index % 6) + 1}`;
    titleBg.textContent = track.name;
    
    // Create artist name.
    const artistName = document.createElement('div');
    artistName.className = 'artist-name';
    artistName.textContent = track.artists.map(a => a.name).join(', ');
    
    // Assemble card.
    card.appendChild(artWrapper);
    card.appendChild(titleBg);
    card.appendChild(artistName);
    
    // Make entire card clickable.
    card.onclick = () => playTrack(track);
    
    return card;
}

/**
 * Plays the selected track.
 * Handles both Spotify (direct URL) and Netease (fetch URL via API) tracks.
 */
async function playTrack(track) {
    if (!track.preview_url) {
        alert('Sorry, this song has no preview audio available.\n\nUnable to get playback URL.');
        return;
    }
    
    currentTrack = track;
    
    // Update player UI using safe DOM properties.
    albumArt.src = track.album.images[0]?.url || 'https://via.placeholder.com/56';
    albumArt.alt = track.name;
    trackName.textContent = track.name;
    trackArtist.textContent = track.artists.map(a => a.name).join(', ');
    
    // Show fixed bottom player.
    musicPlayer.classList.remove('hidden');
    
    try {
        let audioUrl;
        
        // Check if this is a Netease track (preview_url starts with "netease:").
        if (track.preview_url.startsWith('netease:')) {
            const songId = track.preview_url.replace('netease:', '');
            
            // Get selected quality level.
            const quality = qualitySelect.value;
            
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
        audioPlayer.src = audioUrl;
        audioPlayer.load();
        audioPlayer.play();
        
        isPlaying = true;
        updatePlayPauseIcon();
    } catch (error) {
        console.error('Playback error:', error);
        alert('Playback failed. Please try again later.\n\n' + error.message);
    }
}

/**
 * Toggles play/pause state.
 */
function togglePlayPause() {
    if (!currentTrack) return;
    
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
    } else {
        audioPlayer.play();
        isPlaying = true;
    }
    
    updatePlayPauseIcon();
}

/**
 * Updates play/pause button icon.
 */
function updatePlayPauseIcon() {
    playPauseIcon.textContent = isPlaying ? '⏸' : '▶';
}

/**
 * Handles progress bar change.
 */
function handleProgressChange() {
    const time = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
}

/**
 * Handles volume bar change.
 */
function handleVolumeChange() {
    const volume = volumeBar.value / 100;
    audioPlayer.volume = volume;
    updateVolumeIcon(volume);
}

/**
 * Updates volume icon based on volume level.
 */
function updateVolumeIcon(volume) {
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
function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
}

/**
 * Updates duration display.
 */
function updateDuration() {
    if (audioPlayer.duration) {
        duration.textContent = formatTime(audioPlayer.duration);
    }
}

/**
 * Handles track end.
 */
function handleTrackEnd() {
    isPlaying = false;
    updatePlayPauseIcon();
    progressBar.value = 0;
    currentTime.textContent = '0:00';
}

/**
 * Handles audio loading errors.
 */
function handleAudioError() {
    console.error('Audio playback error');
    alert('Audio loading failed. Please try another song.');
    isPlaying = false;
    updatePlayPauseIcon();
}

/**
 * Closes the player panel.
 */
function closePlayerPanel() {
    audioPlayer.pause();
    audioPlayer.src = '';
    musicPlayer.classList.add('hidden');
    isPlaying = false;
    currentTrack = null;
}

/**
 * Shows loading indicator.
 */
function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

/**
 * Hides loading indicator.
 */
function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

/**
 * Hides search results.
 */
function hideResults() {
    searchResults.classList.add('hidden');
}

/**
 * Search History Management Functions.
 */

/**
 * Saves a search query to history.
 * @param {string} query - The search query to save.
 */
function saveSearchHistory(query) {
    if (!query || query.trim() === '') return;
    
    let history = getSearchHistory();
    
    // Remove duplicate if exists.
    history = history.filter(item => item !== query);
    
    // Add to the beginning.
    history.unshift(query);
    
    // Limit to MAX_HISTORY_ITEMS.
    history = history.slice(0, MAX_HISTORY_ITEMS);
    
    // Save to localStorage.
    localStorage.setItem('musicSearchHistory', JSON.stringify(history));
    
    // Update display.
    renderSearchHistory();
}

/**
 * Gets search history from localStorage.
 * @returns {string[]} Array of search queries.
 */
function getSearchHistory() {
    try {
        const history = localStorage.getItem('musicSearchHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error reading search history:', error);
        return [];
    }
}

/**
 * Renders search history list.
 */
function renderSearchHistory() {
    const history = getSearchHistory();
    searchHistoryList.innerHTML = '';
    
    if (history.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'search-history-empty';
        empty.textContent = '暂无搜索历史';
        searchHistoryList.appendChild(empty);
        return;
    }
    
    history.forEach((query, index) => {
        const item = document.createElement('div');
        item.className = 'search-history-item';
        item.setAttribute('data-query', query);
        
        const icon = document.createElement('svg');
        icon.className = 'search-history-item-icon';
        icon.setAttribute('width', '20');
        icon.setAttribute('height', '20');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        icon.setAttribute('stroke-linecap', 'round');
        icon.setAttribute('stroke-linejoin', 'round');
        icon.innerHTML = '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>';
        
        const text = document.createElement('span');
        text.className = 'search-history-item-text';
        text.textContent = query;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'search-history-item-delete';
        deleteBtn.setAttribute('title', '删除');
        deleteBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteHistoryItem(index);
        };
        
        item.appendChild(icon);
        item.appendChild(text);
        item.appendChild(deleteBtn);
        
        item.onclick = () => {
            selectHistoryItem(query);
        };
        
        searchHistoryList.appendChild(item);
    });
}

/**
 * Shows search history dropdown.
 */
function showSearchHistory() {
    const history = getSearchHistory();
    if (history.length > 0) {
        searchHistory.classList.remove('hidden');
    }
}

/**
 * Hides search history dropdown.
 */
function hideSearchHistory() {
    searchHistory.classList.add('hidden');
}

/**
 * Clears all search history.
 */
function clearSearchHistory() {
    if (confirm('确定要清除所有搜索历史吗？')) {
        localStorage.removeItem('musicSearchHistory');
        renderSearchHistory();
        hideSearchHistory();
    }
}

/**
 * Deletes a single history item.
 * @param {number} index - Index of the item to delete.
 */
function deleteHistoryItem(index) {
    let history = getSearchHistory();
    history.splice(index, 1);
    localStorage.setItem('musicSearchHistory', JSON.stringify(history));
    renderSearchHistory();
}

/**
 * Handles search input changes.
 */
function handleSearchInput() {
    const value = songInput.value.trim();
    if (value === '') {
        showSearchHistory();
    } else {
        hideSearchHistory();
    }
}

/**
 * Selects a history item and performs search.
 * @param {string} query - The search query to use.
 */
function selectHistoryItem(query) {
    // Parse query to extract song and artist if possible.
    const parts = query.split(' ');
    if (parts.length >= 2) {
        // Try to split: assume first part is song, rest is artist.
        songInput.value = parts[0];
        artistInput.value = parts.slice(1).join(' ');
    } else {
        songInput.value = query;
        artistInput.value = '';
    }
    
    hideSearchHistory();
    handleSearch();
}

/**
 * Hides player panel.
 */
function hidePlayer() {
    musicPlayer.classList.add('hidden');
}

/**
 * Formats time in seconds to MM:SS format.
 */
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Escapes HTML to prevent XSS.
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load.
document.addEventListener('DOMContentLoaded', init);

