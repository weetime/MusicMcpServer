# MusicMcpServer Project Documentation

## 📋 Project Overview

**Project Name**: MusicMcpServer  
**Version**: 2.1.0  
**Created**: 2025-11-04  
**Last Updated**: 2025-01-XX  
**Purpose**: A unified music search and playback service with independent Netease Cloud Music API service

## 🎯 Project Goals

MusicMcpServer is a standalone music service that:
- Provides seamless music search functionality
- Enables full-length online music playback (not just previews)
- Focuses exclusively on Netease Cloud Music integration
- Offers configurable audio quality levels
- Provides a clean, modern web interface
- Maintains simplicity with single-port deployment
- Ensures ease of setup and maintenance

## 🏗️ Architecture

### Technology Stack

**Backend**:
- Node.js - Runtime environment
- Express.js - Web framework
- Axios - HTTP client
- Netease Service (Independent) - Standalone Netease API service

**Frontend**:
- HTML5 - Semantic markup
- CSS3 - Modern styling with gradients
- Vanilla JavaScript (ES6+) - Application logic
- HTML5 Audio API - Music playback

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Browser Client                          │
│  (HTML5 Interface + Audio Player + Quality Selector)│
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ↓
┌─────────────────────────────────────────────────────┐
│    Express Server (Port 3000)                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Static File Serving (public/)                │   │
│  │  ├── index.html (with quality selector)      │   │
│  │  ├── app.js                                   │   │
│  │  └── style.css                                │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ API Routes (/api/*)                          │   │
│  │  ├── /api/search - Music search              │   │
│  │  ├── /api/song-url/:id?level - Get URL       │   │
│  │  └── /api/lyric/:id - Get lyrics             │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ HTTP Client (services/netease.js)            │   │
│  │  Calls external Netease service via HTTP      │   │
│  └─────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ↓
┌─────────────────────────────────────────────────────┐
│    Netease Service (Port 4000) - Independent         │
│  ┌─────────────────────────────────────────────┐   │
│  │ Express Server                               │   │
│  │  ├── /cloudsearch - Search                   │   │
│  │  ├── /song/url/v1 - Get song URL             │   │
│  │  └── /lyric - Get lyrics                     │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ NeteaseCloudMusicApi                         │   │
│  └─────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│         Netease Cloud Music CDN                      │
│  - High-Quality Audio Streaming (up to Hi-Res)      │
│  - Full Song Playback                                │
│  - Album Artwork                                     │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
MusicMcpServer/
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment configuration (gitignored)
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # User documentation
├── allaboutproject.md    # This file
├── routes/
│   └── search.js          # API route handlers
├── services/
│   └── netease.js         # Netease HTTP client (calls external service)
├── public/                # Frontend static files
│   ├── index.html         # Web interface
│   ├── style.css          # Styling
│   └── app.js             # Frontend logic
├── netease/               # Independent Netease API service
│   ├── server.js          # Netease service entry point
│   ├── package.json       # Netease service dependencies
│   ├── README.md          # Netease service documentation
│   └── .env.example       # Netease service configuration
└── ai-docs/               # Development documentation
```

## 🔧 Core Modules

### server.js
Main application entry point.

**Responsibilities**:
- Express app initialization
- Middleware configuration (CORS, JSON, Static)
- Route registration
- Error handling
- Server startup

**Key Endpoints**:
- `GET /` - Serves web interface
- `GET /api/health` - Health check
- `GET /api/*` - API routes

### services/netease.js
Netease Cloud Music API HTTP client.

**Class**: `NeteaseService`

**Description**: HTTP client that calls the independent Netease API service.

**Methods**:
- `search(keywords, limit)` - Search for songs (calls external service)
- `getSongUrl(id, level)` - Get playback URL (calls external service)
- `getLyric(id)` - Get song lyrics (calls external service)
- `checkHealth()` - Check if Netease API service is available
- `hasCookie()` - Check if cookie is configured
- `getLoginStatus()` - Get login status from Netease service

### routes/search.js
API route handlers.

**Endpoints**:
- `GET /api/search` - Search music
- `GET /api/song-url/:id` - Get song URL
- `GET /api/lyric/:id` - Get lyrics

### Frontend (public/)

**index.html**:
- Semantic HTML5 structure
- Search interface
- Results display
- Music player UI

**style.css**:
- Purple gradient theme
- Responsive design
- Smooth animations
- Mobile-first approach

**app.js**:
- Search handling
- Result display
- Music playback
- UI state management

## 🎵 Features

### Music Search
- Keyword-based search
- Artist filtering
- Configurable result limit (1-50)
- Real-time results display

### Music Playback
- HTML5 Audio player
- Full-length song playback (not limited to 30s)
- Configurable audio quality (Standard to Hi-Res)
- Play/pause controls
- Progress bar with seek
- Volume control
- Album artwork display
- Real-time quality indicator

### User Interface
- Modern purple gradient design
- Responsive layout
- Loading indicators
- Error handling
- Chinese language interface

## 🔄 Data Flow

### Search Flow

```
User Input
    ↓
Frontend (app.js)
    ↓
GET /api/search?q=keyword
    ↓
routes/search.js
    ↓
services/netease.js → NeteaseCloudMusicApi
    ↓
Format Results
    ↓
Response to Frontend
    ↓
Display Results
```

### Playback Flow

```
User Clicks Song
    ↓
Extract Song ID
    ↓
GET /api/song-url/:id
    ↓
services/netease.js → NeteaseCloudMusicApi
    ↓
Get Audio URL
    ↓
Return URL to Frontend
    ↓
HTML5 Audio Player
    ↓
Stream from Netease CDN
```

## ⚙️ Configuration

### Environment Variables

**Main Project**:
```bash
# Server
PORT=3000
NODE_ENV=development

# Netease API Service URL (required)
NETEASE_API_URL=http://localhost:4000
# For production:
# NETEASE_API_URL=https://netease-api.vercel.app
```

**Netease Service** (`netease/.env`):
```bash
# Server
PORT=4000
NODE_ENV=development

# Netease Cookie (optional, for VIP features)
NETEASE_COOKIE=your_cookie_here
```

### NPM Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## 🚀 Deployment

### Local Development

1. **Start Netease Service** (in separate terminal):
   ```bash
   cd netease
   npm install
   npm start
   ```
   Netease service runs on port 4000.

2. **Start Main Server**:
   ```bash
   npm install
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```
   Main server runs on port 3000.

**Note**: Both services must be running for the application to work.

### Production (Vercel)

1. **Deploy Netease Service**:
   - Deploy `netease/` folder as separate Vercel project
   - Set environment variables in Vercel dashboard:
     - `PORT=4000` (or let Vercel assign)
     - `NETEASE_COOKIE` (optional)

2. **Deploy Main Project**:
   - Deploy main project to Vercel
   - Set environment variables:
     - `NETEASE_API_URL=https://your-netease-service.vercel.app`
     - `PORT=3000` (or let Vercel assign)

3. **Deploy**:
   ```bash
   git push
   ```

Vercel auto-deploys on push.

## 🔒 Security

### Implemented Measures

1. **XSS Prevention**:
   - Use `textContent` instead of `innerHTML`
   - DOM API for dynamic content
   - No eval() or similar

2. **CORS Configuration**:
   - Enabled for API access
   - Configurable origins

3. **Input Validation**:
   - Query parameter validation
   - Limit constraints (1-50)
   - Type checking

4. **Error Handling**:
   - Comprehensive try-catch
   - User-friendly error messages
   - Server error logging

## 📊 Performance

### Optimization Strategies

1. **Frontend**:
   - Zero dependencies
   - Minimal bundle size
   - Efficient DOM manipulation
   - CSS animations (GPU-accelerated)

2. **Backend**:
   - Express middleware optimization
   - Axios connection pooling
   - Efficient routing

3. **Audio**:
   - Direct CDN streaming
   - HTML5 Audio API
   - Progressive loading

## ⚠️ Limitations

### Known Constraints

1. **Copyright**:
   - Some songs unavailable due to licensing
   - Regional restrictions may apply
   - VIP-only content excluded

2. **API Dependency**:
   - Relies on NeteaseCloudMusicApi
   - Unofficial API (stability concerns)
   - Rate limiting possible

3. **Features**:
   - No user accounts
   - No playlists
   - No favorites
   - No download capability

## 🔮 Future Enhancements

### Planned Features

1. **Short Term**:
   - Lyrics display
   - Playlist support
   - Playback history
   - Keyboard shortcuts

2. **Medium Term**:
   - User authentication
   - Favorites/likes
   - Comments integration
   - Social sharing

3. **Long Term**:
   - Multiple music sources
   - Offline mode
   - Desktop app (Electron)
   - Mobile apps

## 🐛 Troubleshooting

### Common Issues

**Netease API Not Starting**:
- Check if Netease service is running (port 4000)
- Verify NeteaseCloudMusicApi installation in `netease/` folder
- Check `NETEASE_API_URL` environment variable
- Verify network connectivity between services

**Songs Won't Play**:
- Copyright restrictions
- API rate limiting
- Network issues
- Browser compatibility

**Search Returns Empty**:
- Netease API connection
- Invalid search keywords
- API service down

## 📚 External Dependencies

### Runtime Dependencies

**Main Project**:
- `express` (^4.18.2) - Web framework
- `axios` (^1.6.2) - HTTP client
- `dotenv` (^16.3.1) - Environment variables
- `cors` (^2.8.5) - CORS middleware

**Netease Service** (`netease/package.json`):
- `express` (^4.18.2) - Web framework
- `dotenv` (^16.3.1) - Environment variables
- `NeteaseCloudMusicApi` (^4.15.0) - Music API

### Development Dependencies

- `nodemon` (^3.0.2) - Auto-reload
- `concurrently` (^8.2.2) - Run multiple commands

## 📖 API Documentation

### Search Endpoint

```http
GET /api/search
```

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| q | string | Yes | - | Search keywords |
| limit | number | No | 10 | Results count (1-50) |

**Response**:
```json
{
  "success": true,
  "query": "周杰伦",
  "source": "netease",
  "results": {
    "tracks": {
      "items": [...]
    }
  }
}
```

### Song URL Endpoint

```http
GET /api/song-url/:id
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Song ID |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| level | string | No | standard | Audio quality |

**Response**:
```json
{
  "success": true,
  "id": 186001,
  "url": "http://m10.music.126.net/..."
}
```

## 📝 Development Notes

### Code Style

- ES6+ JavaScript
- Async/await for promises
- JSDoc comments
- English comments only
- Descriptive variable names

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature

# Bug fixes
git checkout -b fix/bug-description
git commit -m "Fix bug description"
git push origin fix/bug-description
```

### Version Control

Format: `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

---

**Last Updated**: 2025-01-XX  
**Version**: 2.1.0  
**Status**: ✅ Production Ready

## 🆕 Version 2.1.0 Highlights

### Key Improvements
1. **Independent Netease Service**: Netease API service separated into standalone project
2. **Vercel Compatible**: No subprocess execution, compatible with Vercel deployment
3. **Better Separation**: Clear separation between main project and Netease service
4. **Independent Deployment**: Each service can be deployed and scaled independently

### Breaking Changes from v2.0.0
- Netease service now runs as independent project (see `netease/` folder)
- Removed `NeteaseCloudMusicApi` dependency from main project
- Requires both services to be running
- `NETEASE_API_URL` environment variable is now required

## 🆕 Version 2.0.0 Highlights

### Key Improvements
1. **Single Port Architecture**: All services integrated on port 3000
2. **Audio Quality Selection**: Choose from 5 quality levels (Standard to Hi-Res)
3. **Full Song Playback**: Complete songs, not just 30-second previews
4. **Simplified Deployment**: One command to start everything
5. **Better User Experience**: Quality indicator and configurable audio settings

### Breaking Changes from v1.0.0
- Netease API now integrated (no separate port 4000)
- Removed `npm run start:all` and `npm run start:netease` commands
- Default audio quality upgraded to "exhigh" (extremely high)
- Simplified startup process

