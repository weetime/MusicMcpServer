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
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),
    
    // Player elements.
    musicPlayer: document.getElementById('musicPlayer'),
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
    instrumentsContent: document.getElementById('instrumentsContent')
};

