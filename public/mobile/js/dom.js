/**
 * DOM Elements Reference Module
 * Centralizes all DOM element references for easy access.
 */

export const dom = {
    // Search elements.
    songInput: document.getElementById('songInput'),
    artistInput: document.getElementById('artistInput'),
    qualitySelect: document.getElementById('qualitySelect'),
    searchBtn: document.getElementById('searchBtn'),
    
    // Results elements.
    loadingIndicator: document.getElementById('loadingIndicator'),
    searchResults: document.getElementById('searchResults'),
    resultsList: document.getElementById('resultsList'),
    resultsCount: document.getElementById('resultsCount'),
    // Note: Mobile uses infinite scroll, no pagination buttons (prevPageBtn, nextPageBtn).
    
    // Player elements.
    musicPlayer: document.getElementById('musicPlayer'), // Now refers to music-player-bar
    closePlayer: document.getElementById('closePlayer'),
    albumArt: document.getElementById('albumArt'),
    trackName: document.getElementById('trackName'),
    trackArtist: document.getElementById('trackArtist'),
    audioPlayer: document.getElementById('audioPlayer'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playPauseIcon: document.getElementById('playPauseIcon'),
    progressBar: document.getElementById('progressBar'),
    currentTime: document.getElementById('currentTime'),
    duration: document.getElementById('duration'),
    volumeBar: document.getElementById('volumeBar'),
    
    // Search history elements.
    searchHistory: document.getElementById('searchHistory'),
    searchHistoryList: document.getElementById('searchHistoryList'),
    clearHistoryBtn: document.getElementById('clearHistoryBtn'),
    
    // Playlist elements.
    queueBtn: document.getElementById('queueBtn'),
    playlistDropdown: document.getElementById('playlistDropdown'),
    playlistList: document.getElementById('playlistList'),
    playlistCount: document.getElementById('playlistCount'),
    
    // Lyrics elements.
    lyricsBtn: document.getElementById('lyricsBtn'),
    lyricsPanel: document.getElementById('lyricsPanel'),
    lyricsContainer: document.getElementById('lyricsContainer'),
    lyricsCloseBtn: document.getElementById('lyricsCloseBtn'),
    
    // Instruments channel elements.
    instrumentsBtn: document.getElementById('instrumentsBtn'),
    instrumentsDropdown: document.getElementById('instrumentsDropdown'),
    instrumentsContent: document.getElementById('instrumentsContent'),
    
    // Bottom navigation elements.
    navHome: document.getElementById('navHome'),
    navInstruments: document.getElementById('navInstruments'),
    navTheme: document.getElementById('navTheme'),
    
    // Theme elements.
    themeBtn: document.getElementById('themeBtn'),
    themeDropdown: document.getElementById('themeDropdown'),
    themeList: document.getElementById('themeList'),
    
    // Pagination elements (not used in mobile, kept for compatibility).
    paginationContainer: document.getElementById('paginationContainer'),
    
    // Player control elements.
    shuffleBtn: document.getElementById('shuffleBtn'),
    repeatBtn: document.getElementById('repeatBtn'),
    
    // Fullscreen player elements.
    fullscreenPlayer: document.getElementById('fullscreenPlayer'),
    fullscreenPlayerBackBtn: document.getElementById('fullscreenPlayerBackBtn'),
    fullscreenAlbumArt: document.getElementById('fullscreenAlbumArt'),
    fullscreenSongTitleOverlay: document.getElementById('fullscreenSongTitleOverlay'),
    fullscreenArtistOverlay: document.getElementById('fullscreenArtistOverlay'),
    fullscreenTrackName: document.getElementById('fullscreenTrackName'),
    fullscreenTrackArtist: document.getElementById('fullscreenTrackArtist'),
    fullscreenQualityLabel: document.getElementById('fullscreenQualityLabel'),
    fullscreenLyricsContainer: document.getElementById('fullscreenLyricsContainer'),
    fullscreenLyricsContent: document.getElementById('fullscreenLyricsContent'),
    fullscreenProgressBar: document.getElementById('fullscreenProgressBar'),
    fullscreenCurrentTime: document.getElementById('fullscreenCurrentTime'),
    fullscreenDuration: document.getElementById('fullscreenDuration'),
    fullscreenShuffleBtn: document.getElementById('fullscreenShuffleBtn'),
    fullscreenPrevBtn: document.getElementById('fullscreenPrevBtn'),
    fullscreenPlayPauseBtn: document.getElementById('fullscreenPlayPauseBtn'),
    fullscreenPlayPauseIcon: document.getElementById('fullscreenPlayPauseIcon'),
    fullscreenNextBtn: document.getElementById('fullscreenNextBtn'),
    fullscreenQueueBtn: document.getElementById('fullscreenQueueBtn')
};

