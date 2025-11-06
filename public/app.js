/**
 * MusicCore Frontend Application
 * Handles music search and playback functionality.
 */

// DOM Elements.
const songInput = document.getElementById('songInput');
const artistInput = document.getElementById('artistInput');
const searchBtn = document.getElementById('searchBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const searchResults = document.getElementById('searchResults');
const resultsList = document.getElementById('resultsList');
const musicPlayer = document.getElementById('musicPlayer');
const closePlayer = document.getElementById('closePlayer');
const albumArt = document.getElementById('albumArt');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');
const trackAlbum = document.getElementById('trackAlbum');
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const loginLink = document.getElementById('loginLink');
const registerLink = document.getElementById('registerLink');

// Application state.
let currentTrack = null;
let isPlaying = false;

/**
 * Initializes the application.
 */
function init() {
    // Event listeners.
    searchBtn.addEventListener('click', handleSearch);
    songInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    artistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
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
    
    // Login/Register placeholders.
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('用户登录功能即将推出！');
    });
    
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('用户注册功能即将推出！');
    });
    
    // Set initial volume.
    audioPlayer.volume = volumeBar.value / 100;
}

/**
 * Handles search button click.
 * Default music source is Netease Cloud Music for better Chinese song support.
 */
async function handleSearch() {
    const song = songInput.value.trim();
    const artist = artistInput.value.trim();
    
    if (!song) {
        alert('请输入歌曲名称！');
        return;
    }
    
    // Build search query for Netease (simply combine with space).
    let query = song;
    if (artist) {
        query += ` ${artist}`;
    }
    
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
            alert('未找到相关歌曲，请尝试其他关键词');
            hideLoading();
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('搜索出错：' + error.message);
        hideLoading();
    }
}

/**
 * Displays search results.
 */
function displayResults(tracks) {
    hideLoading();
    
    resultsList.innerHTML = '';
    
    tracks.forEach(track => {
        const resultItem = createResultItem(track);
        resultsList.appendChild(resultItem);
    });
    
    searchResults.classList.remove('hidden');
}

/**
 * Creates a result item element.
 * Uses DOM API instead of innerHTML to prevent XSS vulnerabilities.
 */
function createResultItem(track) {
    const div = document.createElement('div');
    div.className = 'result-item';
    div.onclick = () => playTrack(track);
    
    // Create album art image.
    const img = document.createElement('img');
    img.className = 'result-album-art';
    img.src = track.album.images[0]?.url || 'https://via.placeholder.com/80';
    img.alt = track.name;
    
    // Create result info container.
    const resultInfo = document.createElement('div');
    resultInfo.className = 'result-info';
    
    // Create track name.
    const resultName = document.createElement('div');
    resultName.className = 'result-name';
    resultName.textContent = track.name;
    
    // Create artist names.
    const resultArtist = document.createElement('div');
    resultArtist.className = 'result-artist';
    resultArtist.textContent = track.artists.map(a => a.name).join(', ');
    
    // Create album info with preview warning.
    const resultAlbum = document.createElement('div');
    resultAlbum.className = 'result-album';
    resultAlbum.textContent = track.album.name;
    
    // Add preview warning if needed.
    if (!track.preview_url) {
        const warning = document.createElement('span');
        warning.style.color = '#e53e3e';
        warning.style.fontSize = '12px';
        warning.textContent = ' ⚠️ 无预览';
        resultAlbum.appendChild(warning);
    }
    
    // Assemble result info.
    resultInfo.appendChild(resultName);
    resultInfo.appendChild(resultArtist);
    resultInfo.appendChild(resultAlbum);
    
    // Create play icon.
    const playIcon = document.createElement('div');
    playIcon.className = 'play-icon';
    playIcon.textContent = '▶️';
    
    // Assemble result item.
    div.appendChild(img);
    div.appendChild(resultInfo);
    div.appendChild(playIcon);
    
    return div;
}

/**
 * Plays the selected track.
 * Handles both Spotify (direct URL) and Netease (fetch URL via API) tracks.
 */
async function playTrack(track) {
    if (!track.preview_url) {
        alert('抱歉，该歌曲暂无预览音频！\n\n无法获取播放链接。');
        return;
    }
    
    currentTrack = track;
    
    // Update player UI using safe DOM properties.
    albumArt.src = track.album.images[0]?.url || 'https://via.placeholder.com/200';
    albumArt.alt = track.name;
    trackName.textContent = track.name;
    trackArtist.textContent = track.artists.map(a => a.name).join(', ');
    trackAlbum.textContent = track.album.name;
    
    // Show player first for better UX.
    musicPlayer.classList.remove('hidden');
    musicPlayer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    try {
        let audioUrl;
        
        // Check if this is a Netease track (preview_url starts with "netease:").
        if (track.preview_url.startsWith('netease:')) {
            const songId = track.preview_url.replace('netease:', '');
            
            // Fetch the actual playback URL from API.
            const response = await fetch(`/api/song-url/${songId}`);
            const data = await response.json();
            
            if (!data.success || !data.url) {
                alert('抱歉，该歌曲暂无可用音频！\n\n可能是版权限制或歌曲已下架。');
                return;
            }
            
            audioUrl = data.url;
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
        console.error('播放失败:', error);
        alert('播放失败，请稍后重试！\n\n' + error.message);
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
    playPauseIcon.textContent = isPlaying ? '⏸️' : '▶️';
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
    audioPlayer.volume = volumeBar.value / 100;
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
    alert('音频加载失败，请尝试其他歌曲');
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

