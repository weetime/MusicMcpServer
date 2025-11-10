# 🎵 MusicMcpServer

A modern music search and playback service powered by Netease Cloud Music API.

## ✨ Features

- 🎵 **Rich Music Library** - Access millions of Chinese songs from Netease Cloud Music
- 🔍 **Powerful Search** - Search by song name, artist, or album
- ▶️ **Online Playback** - Stream high-quality audio directly
- 🎨 **Modern UI** - Beautiful purple gradient interface
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🚀 **Fast & Lightweight** - Minimal dependencies, pure vanilla JavaScript

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd MusicMcpServer

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Running Locally

You need to run two services:

#### Terminal 1 - Netease API Service:
```bash
npm run start:netease
```

This starts the Netease Cloud Music API on port 4000.

#### Terminal 2 - MusicMcpServer:
```bash
npm start
# or for development with auto-reload
npm run dev
```

#### Or use one command:
```bash
npm run start:all
```

This will start both services concurrently.

### Access the Application

Open your browser and visit: **http://localhost:3000/**

---

## 🎯 Usage

### Search Music

1. Enter song name in the first input field (e.g., `七里香`, `稻香`)
2. Optionally add artist name in the second field (e.g., `周杰伦`)
3. Click "搜索" button or press Enter
4. Browse search results

### Play Music

1. Click on any search result
2. Player opens automatically and starts playing
3. Use controls:
   - ▶️/⏸️ Play/Pause
   - 🎚️ Drag progress bar to seek
   - 🔊 Adjust volume

---

## 📁 Project Structure

```
MusicMcpServer/
├── server.js              # Main server entry point
├── routes/
│   └── search.js          # API routes for search and playback
├── services/
│   └── netease.js         # Netease Cloud Music service
├── public/                # Frontend static files
│   ├── index.html         # Web interface
│   ├── style.css          # UI styling
│   └── app.js             # Frontend application logic
├── ai-docs/               # AI development documentation
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

---

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

Returns server status and available endpoints.

### Search Music
```
GET /api/search?q=<query>&limit=<number>
```

**Parameters:**
- `q` (required): Search keywords
- `limit` (optional): Number of results (1-50, default: 10)

**Example:**
```bash
curl "http://localhost:3000/api/search?q=周杰伦&limit=10"
```

### Get Song URL
```
GET /api/song-url/:id?level=<quality>
```

**Parameters:**
- `id` (required): Song ID
- `level` (optional): Audio quality (standard, higher, exhigh, lossless)

**Example:**
```bash
curl "http://localhost:3000/api/song-url/186001?level=standard"
```

### Get Lyrics
```
GET /api/lyric/:id
```

**Parameters:**
- `id` (required): Song ID

**Example:**
```bash
curl "http://localhost:3000/api/lyric/186001"
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Fork or Push to Git Repository**

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your repository

3. **Set Environment Variables**

   In Vercel Dashboard → Settings → Environment Variables:
   
   | Variable | Value |
   |----------|-------|
   | `NETEASE_API_URL` | `https://netease-cloud-music-api-rouge.vercel.app` |
   | `NODE_ENV` | `production` |

4. **Deploy**

   Vercel will automatically build and deploy your project.

### Public Netease API Instances

Use these public instances for deployment:
- https://netease-cloud-music-api-rouge.vercel.app
- https://music-api.heheda.top
- https://netease-api.vercel.app

Or deploy your own: [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```bash
# Netease API Configuration
NETEASE_API_URL=http://localhost:4000

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 💡 Tips & Tricks

### Search Tips

1. **Direct song name**: `七里香`
2. **Song + Artist**: `七里香 周杰伦`
3. **Artist only**: `周杰伦` (returns popular songs)
4. **English songs**: `Shape of You`

### Popular Searches

```
✅ Chinese Songs:
- 稻香
- 晴天
- 告白气球
- 演员
- 夜曲

✅ Popular Artists:
- 周杰伦
- 邓紫棋
- 林俊杰
- 陈奕迅
- 薛之谦
```

---

## ⚠️ Important Notes

### Copyright Restrictions

- Some songs may not be playable due to copyright restrictions
- Regional restrictions may apply
- VIP-only songs require membership

### Unofficial API

⚠️ **Important**: NeteaseCloudMusicApi is an unofficial project:
- For personal and educational use only
- Not guaranteed for long-term stability
- Please comply with Netease Cloud Music's terms of service
- Commercial use at your own risk

---

## 🐛 Troubleshooting

### Q: No search results?

**A**: Check:
1. Netease API service is running (port 4000)
2. Network connection is working
3. Try different search keywords

### Q: Cannot play songs?

**A**: Possible reasons:
1. Song has no playback URL (copyright restrictions)
2. Netease API rate limiting
3. Network issues

Solutions:
- Try different songs
- Wait a few moments and try again
- Check browser console for errors (F12)

### Q: Netease API won't start?

**A**: Check:
```bash
# Check if port is in use
lsof -i :4000

# If occupied, use different port
PORT=5000 npx NeteaseCloudMusicApi
# Update .env accordingly
```

---

## 🛠 Tech Stack

**Backend:**
- Node.js
- Express.js
- Axios
- NeteaseCloudMusicApi

**Frontend:**
- HTML5
- CSS3 (with gradients and animations)
- Vanilla JavaScript (ES6+)
- HTML5 Audio API

---

## 📄 License

ISC

---

## 🙏 Credits

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) - Unofficial Netease Cloud Music API
- [Netease Cloud Music](https://music.163.com/) - Music platform

---

## 📞 Support

For issues and feature requests, please refer to the project documentation in the `ai-docs/` directory.

---

**Enjoy the music!** 🎵✨

