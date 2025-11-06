# 🚀 MusicMcpServer - Quick Start Guide

## ⚡ 1-Minute Setup

### Step 1: Install Dependencies
```bash
cd /Users/fangyong/agent/MusicMcpServer
npm install
```

### Step 2: Start Services

**Option A - One Command (Recommended)**:
```bash
npm run start:all
```

**Option B - Separate Terminals**:

Terminal 1 - Start Netease API:
```bash
npm run start:netease
```

Terminal 2 - Start MusicMcpServer:
```bash
npm run dev
```

### Step 3: Open Browser

Visit: **http://localhost:3000/**

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

✅ **NEW PROJECT**: MusicMcpServer  
✅ **SOURCE**: Migrated from MusicCore  
✅ **FOCUS**: Netease Cloud Music only  
✅ **STATUS**: Ready to use

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

## ⚠️ Notes

1. **Netease API Required**: Port 4000 must be available
2. **Copyright**: Some songs may be unavailable
3. **Unofficial API**: For educational use only

---

## 🆘 Quick Troubleshooting

### Can't start Netease API?
```bash
# Check if port 4000 is in use
lsof -i :4000

# Use different port
PORT=5000 npx NeteaseCloudMusicApi
```

### Can't access localhost:3000?
```bash
# Check if port 3000 is in use
lsof -i :3000

# Or change port in .env
PORT=8080
```

---

**Ready to play music!** 🎵✨

