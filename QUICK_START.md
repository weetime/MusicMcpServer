# 🚀 MusicMcpServer - Quick Start Guide

## ⚡ 30-Second Setup

### Step 1: Install Dependencies
```bash
cd /Users/fangyong/agent/MusicMcpServer
npm install
```

### Step 2: Start Server (Single Command!)
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

### Step 3: Open Browser

Visit: **http://localhost:3000/**

🎉 **That's it!** All services (Web UI + API + Netease API) run on one port!

---

## 🎵 Try These Searches

```
✅ 周杰伦
✅ 七里香
✅ 稻香
✅ 邓紫棋
✅ 告白气球
```

---

## 📊 Project Status

✅ **PROJECT**: MusicMcpServer v2.0  
✅ **SINGLE PORT**: All services on port 3000  
✅ **AUDIO QUALITY**: Configurable quality levels  
✅ **FULL SONGS**: Not just 30s previews  
✅ **STATUS**: Production ready

---

## 📁 Project Location

```
/Users/fangyong/agent/MusicMcpServer/
```

---

## 🔗 Important Links

- **Web Interface**: http://localhost:3000/
- **API Health**: http://localhost:3000/api/health
- **Search API**: http://localhost:3000/api/search?q=keyword

---

## 📚 Documentation

- `README.md` - Complete user guide
- `allaboutproject.md` - Technical documentation
- `changelog.md` - Version history
- `ai-docs/` - Development documentation

---

## 🎵 New Features

1. **🎚️ Audio Quality Selection**: Choose from Standard to Hi-Res quality
2. **🔊 Full Song Playback**: Complete songs, not just 30s previews
3. **⚡ Single Port**: Everything runs on port 3000
4. **🚀 Simpler Deployment**: One command to start

## ⚠️ Notes

1. **Copyright**: Some songs may be unavailable due to licensing
2. **Quality**: Higher quality requires good internet connection
3. **Unofficial API**: For educational use only

---

## 🆘 Quick Troubleshooting

### Can't access localhost:3000?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=8080
```

### Songs won't play?
- Try a lower quality level (Standard or Higher)
- Check internet connection
- Some songs may have copyright restrictions

### Audio cuts off at 30 seconds?
- Switch to "极高音质" (Extremely High) or higher
- Make sure you're using the latest version

---

**Ready to play music!** 🎵✨

