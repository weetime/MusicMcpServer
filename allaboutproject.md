# MusicMcpServer Project Documentation

## 📋 Project Overview

**Project Name**: MusicMcpServer  
**Version**: 1.0.0  
**Created**: 2025-11-04  
**Purpose**: A dedicated music search and playback service using Netease Cloud Music API

## 🎯 Project Goals

MusicMcpServer is a standalone music service that:
- Provides seamless music search functionality
- Enables online music playback
- Focuses exclusively on Netease Cloud Music integration
- Offers a clean, modern web interface
- Maintains simplicity and ease of deployment

## 🏗️ Architecture

### Technology Stack

**Backend**:
- Node.js - Runtime environment
- Express.js - Web framework
- Axios - HTTP client
- NeteaseCloudMusicApi - Music API integration

**Frontend**:
- HTML5 - Semantic markup
- CSS3 - Modern styling with gradients
- Vanilla JavaScript (ES6+) - Application logic
- HTML5 Audio API - Music playback

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Browser Client                          │
│  (HTML5 Interface + Audio Player)                   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ↓
┌─────────────────────────────────────────────────────┐
│        Express Server (MusicMcpServer)               │
│  ├── Static File Serving (public/)                  │
│  ├── /api/search - Music search                     │
│  ├── /api/song-url/:id - Get playback URL           │
│  └── /api/lyric/:id - Get lyrics                    │
└────────────────────┬────────────────────────────────┘
                     │
                     │ API Calls
                     ↓
┌─────────────────────────────────────────────────────┐
│     NeteaseCloudMusicApi (Port 4000)                 │
│  - Cloud Search                                      │
│  - Song URL Retrieval                                │
│  - Lyric Retrieval                                   │
└─────────────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│         Netease Cloud Music CDN                      │
│  - Audio Streaming                                   │
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
│   └── netease.js         # Netease service integration
├── public/                # Frontend static files
│   ├── index.html         # Web interface
│   ├── style.css          # Styling
│   └── app.js             # Frontend logic
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
Netease Cloud Music API integration.

**Class**: `NeteaseService`

**Methods**:
- `search(keywords, limit)` - Search for songs
- `getSongUrl(id, level)` - Get playback URL
- `getLyric(id)` - Get song lyrics
- `checkHealth()` - Check API availability

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
- Play/pause controls
- Progress bar with seek
- Volume control
- Album artwork display

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

```bash
# Netease API
NETEASE_API_URL=http://localhost:4000
NETEASE_API_PORT=4000

# Server
PORT=3000
NODE_ENV=development
```

### NPM Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "start:netease": "PORT=4000 npx NeteaseCloudMusicApi",
  "start:all": "concurrently \"npm run start:netease\" \"npm run dev\""
}
```

## 🚀 Deployment

### Local Development

1. Start Netease API:
   ```bash
   npm run start:netease
   ```

2. Start MusicMcpServer:
   ```bash
   npm run dev
   ```

### Production (Vercel)

1. Set environment variables:
   - `NETEASE_API_URL=https://netease-api.vercel.app`

2. Deploy:
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
- Check port 4000 availability
- Verify NeteaseCloudMusicApi installation
- Check network connectivity

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

- `express` (^4.18.2) - Web framework
- `axios` (^1.6.2) - HTTP client
- `dotenv` (^16.3.1) - Environment variables
- `cors` (^2.8.5) - CORS middleware
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

**Last Updated**: 2025-11-04  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

