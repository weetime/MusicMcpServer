# Changelog

All notable changes to MusicMcpServer project will be documented in this file.

## [2.1.0] - 2025-01-XX

### 🚀 Major Update: Netease Service Separation

This update separates the Netease API service into an independent project to support Vercel deployment (which doesn't support subprocesses).

### 🎯 Key Improvements

#### 1. **Independent Netease Service** 🔄
- **BREAKING**: Netease API service moved to separate `netease/` folder
- Netease service runs as independent project
- Main project now calls Netease service via HTTP
- Removed subprocess execution (exec/child_process)
- Compatible with Vercel deployment restrictions

#### 2. **Project Structure** 📁
- Created `netease/` folder with standalone service
- Independent `package.json` for Netease service
- Independent server.js for Netease API
- Main project no longer includes NeteaseCloudMusicApi dependency

### Added

- **Netease Service** (`netease/` folder):
  - Standalone Express server for Netease API
  - Independent package.json with NeteaseCloudMusicApi dependency
  - README.md with deployment instructions
  - .env.example for configuration

### Changed

- **Server Architecture**:
  - Removed subprocess execution from main server.js
  - Removed NeteaseCloudMusicApi dependency from main project
  - Main project now uses HTTP client to call Netease service
  - Updated services/netease.js to clarify it calls external service

- **Dependencies**:
  - Removed `NeteaseCloudMusicApi` from main project's package.json
  - NeteaseCloudMusicApi now only in netease/package.json

- **Health Check**:
  - Added Netease API health status check
  - Shows Netease API URL and connection status

### Removed

- Subprocess execution (exec/child_process)
- NeteaseCloudMusicApi dependency from main project
- Internal Netease API startup code
- Process management code (SIGTERM/SIGINT handlers for Netease process)

### Technical Details

#### Architecture Changes

**Before**:
```
Main Project (Port 3000)
    ├── Express Server
    └── NeteaseCloudMusicApi (subprocess on Port 4000)
```

**After**:
```
Main Project (Port 3000)
    └── Express Server
        └── HTTP Client → Netease Service (Port 4000)
            └── Netease Service (Independent Project)
                └── NeteaseCloudMusicApi
```

#### Migration Guide

1. **Start Netease Service**:
   ```bash
   cd netease
   npm install
   npm start
   ```

2. **Start Main Project**:
   ```bash
   npm install
   npm start
   ```

3. **Environment Variables**:
   - Main project: `NETEASE_API_URL` (default: `http://localhost:4000`)
   - Netease service: `PORT` (default: 4000), `NETEASE_COOKIE` (optional)

### Deployment

- **Vercel**: Deploy Netease service separately, then set `NETEASE_API_URL` in main project
- **Local**: Run both services independently
- **Docker**: Can containerize each service separately

### Notes

- ✅ Vercel-compatible (no subprocesses)
- ✅ Better separation of concerns
- ✅ Independent deployment and scaling
- ⚠️ Requires both services to be running

---

## [2.0.0] - 2025-11-06

### 🚀 Major Update: Single Port Integration & Full Song Playback

This is a major architectural improvement that simplifies deployment and enhances user experience.

### 🎯 Key Improvements

#### 1. **Single Port Architecture** 🔄
- **BREAKING**: Integrated NeteaseCloudMusicApi directly into Express server
- All services now run on port 3000 (Web UI + API + Netease API)
- Removed dependency on separate port 4000 for Netease API
- Simplified deployment with single command: `npm start`
- Eliminated need for `concurrently` package

#### 2. **Audio Quality Selection** 🎚️
- Added configurable audio quality levels:
  - Standard (标准)
  - Higher (较高)
  - **Extremely High (极高)** - Default, recommended
  - Lossless (无损)
  - Hi-Res (Hi-Res)
- Quality selector integrated into search form
- Real-time quality display in player
- Users can choose quality based on network conditions

#### 3. **Full Song Playback** 🔊
- Changed default quality from `standard` to `exhigh`
- Enables playback of complete songs (not just 30s previews)
- Better audio quality by default
- Quality validation on backend API

### Added

- **Frontend**:
  - Audio quality selector dropdown in search form
  - Quality display indicator in music player
  - Quality level mapping for Chinese display
  - Improved preview notice with quality info

- **Backend**:
  - Quality level validation in `/api/song-url/:id` endpoint
  - Support for 8 quality levels (standard, higher, exhigh, lossless, hires, jyeffect, sky, jymaster)
  - NeteaseCloudMusicApi integrated as Express middleware
  - Routes mounted under `/netease` prefix

- **Styling**:
  - `.quality-select` CSS class for dropdown
  - Responsive quality selector for mobile
  - Updated preview notice styling with gradient background
  - Quality indicator color highlighting

### Changed

- **Server Architecture**:
  - NeteaseCloudMusicApi now runs as Express middleware
  - Services integrated into single process
  - Default Netease API URL changed from `http://localhost:4000` to `http://localhost:3000/netease`
  
- **Default Behavior**:
  - Default audio quality upgraded from `standard` to `exhigh`
  - Better quality enables full song playback
  
- **Startup Process**:
  - Removed `npm run start:all` command
  - Removed `npm run start:netease` command
  - Simplified to `npm start` or `npm run dev`
  - Removed `concurrently` from devDependencies

- **Documentation**:
  - Updated QUICK_START.md with simplified setup
  - Updated health check messages
  - Added troubleshooting for quality issues

### Removed

- Separate Netease API startup requirement
- Port 4000 dependency
- `concurrently` package dependency
- Complex multi-process startup scripts

### Technical Details

#### Architecture Changes

**Before**:
```
Port 3000: Express Server (Web UI + API)
    ↓ HTTP requests
Port 4000: NeteaseCloudMusicApi (separate process)
```

**After**:
```
Port 3000: Express Server
    ├── Web UI (Static Files)
    ├── API Routes (/api/*)
    └── Netease API (/netease/*)
```

#### API Updates

- **Song URL Endpoint** (`/api/song-url/:id`):
  - Added quality validation
  - Default quality changed to `exhigh`
  - Returns quality level in response
  - Better error messages for quality issues

#### Frontend Updates

- **Quality Selector**:
  - HTML select element with 5 quality options
  - Default to "极高音质 (推荐)"
  - Passed to API during song URL fetch
  - Displayed in player interface

### Performance

- ✅ Reduced process overhead (single process vs. two)
- ✅ Lower memory footprint
- ✅ Faster startup time
- ✅ Simplified port management

### Migration Guide

#### For Existing Users

1. **Update dependencies**:
   ```bash
   npm install
   ```

2. **Start server** (new command):
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

3. **No environment changes needed** - `NETEASE_API_URL` still supported for external APIs

#### Breaking Changes

- ⚠️ `npm run start:all` command removed
- ⚠️ `npm run start:netease` command removed
- ⚠️ Port 4000 no longer used by default
- ⚠️ `concurrently` package no longer needed

### Bug Fixes

- Fixed 30-second audio limitation by using higher quality levels
- Improved error messages for unavailable songs
- Better handling of quality level fallbacks

### Notes

- 🎉 Simpler deployment and development workflow
- 🎵 Better audio quality out of the box
- ⚡ Single command to start everything
- 🔧 Easier to maintain and debug

---

## [1.0.0] - 2025-11-04

### 🎉 Initial Release

**Project Created**: MusicMcpServer - A dedicated music service powered by Netease Cloud Music API

### Added

- **Core Functionality**:
  - Music search via Netease Cloud Music API
  - Online music playback
  - Song URL retrieval
  - Lyrics retrieval support
  
- **Backend**:
  - Express.js server setup
  - RESTful API endpoints
  - Netease service integration
  - Error handling middleware
  - CORS support
  
- **Frontend**:
  - Modern web interface with purple gradient theme
  - Responsive design (desktop, tablet, mobile)
  - Search interface with song and artist fields
  - Interactive music player:
    - Play/pause controls
    - Progress bar with seek
    - Volume control
    - Album artwork display
    - Real-time progress tracking
  
- **API Endpoints**:
  - `GET /api/health` - Health check
  - `GET /api/search` - Search music
  - `GET /api/song-url/:id` - Get playback URL
  - `GET /api/lyric/:id` - Get lyrics

- **Configuration**:
  - Environment variable support
  - `.env.example` template
  - `.gitignore` for Node.js projects
  
- **Documentation**:
  - Comprehensive README.md
  - Detailed allaboutproject.md
  - This changelog
  - Code comments (English)

### Technical Details

- **Backend Stack**:
  - Node.js runtime
  - Express.js ^4.18.2
  - Axios ^1.6.2
  - NeteaseCloudMusicApi ^4.15.0
  
- **Frontend Stack**:
  - Pure HTML5
  - CSS3 with gradients and animations
  - Vanilla JavaScript (ES6+)
  - HTML5 Audio API
  
- **Architecture**:
  - Service-oriented design
  - Modular route structure
  - Separation of concerns
  - Single responsibility principle

### Features

- ✅ Search Chinese and international songs
- ✅ High-quality audio streaming
- ✅ Real-time search results
- ✅ Responsive user interface
- ✅ Album artwork display
- ✅ Progress and volume controls
- ✅ Error handling and user feedback
- ✅ Mobile-friendly design

### Security

- XSS prevention via DOM API
- Input validation on all endpoints
- Safe HTML rendering
- CORS configuration
- Error message sanitization

### Performance

- Zero frontend dependencies
- Minimal bundle size
- Direct CDN audio streaming
- Efficient DOM manipulation
- CSS hardware acceleration

### Notes

- ⚠️ **Important**: Uses unofficial Netease API
- 📝 For personal and educational use only
- 🔒 Some songs may be unavailable due to copyright
- 🌍 Regional restrictions may apply

### Files Structure

```
MusicMcpServer/
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── README.md
├── allaboutproject.md
├── changelog.md
├── routes/
│   └── search.js
├── services/
│   └── netease.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── ai-docs/
```

### Deployment Ready

- ✅ Local development setup
- ✅ Vercel deployment compatible
- ✅ Environment configuration
- ✅ Health check endpoint
- ✅ Comprehensive documentation

---

**Version Format**: [MAJOR.MINOR.PATCH]
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

---

**Project Status**: ✅ **PRODUCTION READY**  
**Initial Release Date**: 2025-11-04

