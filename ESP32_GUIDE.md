# ESP32 集成指南

本指南说明如何在 ESP32 中使用 MusicMcpServer API 来搜索和播放音乐。

---

## 🎯 概述

MusicMcpServer 提供了专门为 ESP32 优化的 API 端点，可以直接搜索并返回可播放的音乐 URL。

---

## 📡 API 端点

### 1. ESP32 专用搜索端点（推荐）

**接口**: `GET /api/esp32/song`

这个端点会自动搜索歌曲并返回第一个可播放的 URL，非常适合 ESP32 使用。

**请求参数**:
- `q` (可选): 歌曲名称
- `artist` (可选): 歌手名称
- `level` (可选): 音质级别，默认 `higher`
  - `standard` - 标准音质（最小带宽）
  - `higher` - 较高音质（推荐 ESP32 使用）
  - `exhigh` - 极高音质
  - `lossless` - 无损音质

**注意**: `q` 和 `artist` 至少需要提供一个参数。

**搜索模式**:

1. **只搜索歌曲名**:
   ```
   GET /api/esp32/song?q=告白气球
   ```

2. **只搜索歌手**:
   ```
   GET /api/esp32/song?artist=周杰伦
   ```

3. **歌曲名 + 歌手（精确搜索）**:
   ```
   GET /api/esp32/song?q=告白气球&artist=周杰伦
   ```

**示例请求**:
```
# 只搜索歌曲名
http://your-server:3000/api/esp32/song?q=告白气球

# 只搜索歌手（返回该歌手的热门歌曲）
http://your-server:3000/api/esp32/song?artist=周杰伦

# 精确搜索：歌曲名 + 歌手
http://your-server:3000/api/esp32/song?q=告白气球&artist=周杰伦

# 指定音质
http://your-server:3000/api/esp32/song?q=稻香&artist=周杰伦&level=standard
```

**响应示例**:
```json
{
  "success": true,
  "song": {
    "id": 419594013,
    "name": "告白气球",
    "artist": "周杰伦",
    "url": "http://m10.music.126.net/xxx/xxx.mp3",
    "duration_ms": 266000,
    "quality": "higher"
  },
  "search_info": {
    "query": "告白气球 周杰伦",
    "matched": "song_and_artist"
  }
}
```

**search_info 说明**:
- `query`: 实际使用的搜索关键词
- `matched`: 匹配模式
  - `song_and_artist`: 歌曲名和歌手都匹配
  - `song_name`: 仅匹配歌曲名
  - `artist_name`: 仅匹配歌手名

**错误响应**:
```json
{
  "error": "No playable song found. Try different search terms or quality level."
}
```

---

### 2. 分步 API（高级用户）

如果你需要更多控制，可以使用分步API：

#### 步骤 1: 搜索歌曲
```
GET /api/search?q=周杰伦&limit=10
```

响应包含歌曲列表，每首歌有 `id` 字段。

#### 步骤 2: 获取播放 URL
```
GET /api/song-url/{id}?level=higher
```

使用步骤1中的 `id` 获取播放 URL。

---

## 🔧 ESP32 示例代码

### Arduino/ESP-IDF 示例

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Audio.h>

// WiFi 配置
const char* ssid = "Your_SSID";
const char* password = "Your_Password";

// MusicMcpServer 地址
const char* serverUrl = "http://your-server-ip:3000";

// Audio 库初始化
Audio audio;

void setup() {
    Serial.begin(115200);
    
    // 连接 WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");
    
    // 初始化音频输出（根据你的硬件配置）
    audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
    audio.setVolume(15); // 0-21
}

void loop() {
    // 搜索并播放歌曲
    playSong("告白气球");
    
    delay(60000); // 等待1分钟后播放下一首
}

// 方式1: 只搜索歌曲名
void playSong(const char* songName) {
    playSong(songName, NULL, "standard");
}

// 方式2: 搜索歌曲名 + 歌手（精确搜索）
void playSong(const char* songName, const char* artist) {
    playSong(songName, artist, "standard");
}

// 方式3: 完整参数（歌曲名 + 歌手 + 音质）
void playSong(const char* songName, const char* artist, const char* quality) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        
        // 构建请求 URL
        String url = String(serverUrl) + "/api/esp32/song?";
        
        if (songName) {
            url += "q=" + String(songName);
        }
        
        if (artist) {
            if (songName) url += "&";
            url += "artist=" + String(artist);
        }
        
        if (quality) {
            url += "&level=" + String(quality);
        }
        
        Serial.println("Requesting: " + url);
        http.begin(url);
        
        int httpCode = http.GET();
        
        if (httpCode == 200) {
            String payload = http.getString();
            Serial.println("Response: " + payload);
            
            // 解析 JSON
            DynamicJsonDocument doc(1024);
            deserializeJson(doc, payload);
            
            if (doc["success"]) {
                const char* songUrl = doc["song"]["url"];
                const char* name = doc["song"]["name"];
                const char* artistName = doc["song"]["artist"];
                
                Serial.printf("Playing: %s - %s\n", name, artistName);
                Serial.println("URL: " + String(songUrl));
                
                // 播放音频
                audio.connecttohost(songUrl);
                
            } else {
                Serial.println("Error: No playable song found");
            }
        } else {
            Serial.printf("HTTP Error: %d\n", httpCode);
        }
        
        http.end();
    }
}

// 使用示例
void loop() {
    // 只搜索歌曲名
    playSong("告白气球");
    delay(60000);
    
    // 精确搜索（歌曲名 + 歌手）
    playSong("告白气球", "周杰伦");
    delay(60000);
    
    // 只搜索歌手（返回该歌手的热门歌曲）
    playSong(NULL, "周杰伦", "higher");
    delay(60000);
}

// Audio 事件处理
void audio_info(const char *info) {
    Serial.print("Audio info: "); Serial.println(info);
}

void audio_eof_mp3(const char *info) {
    Serial.println("Song finished!");
}
```

---

## 🛠️ 使用 cURL 测试

### 测试 ESP32 端点

**只搜索歌曲名**:
```bash
curl "http://localhost:3000/api/esp32/song?q=告白气球"
```

**只搜索歌手**:
```bash
curl "http://localhost:3000/api/esp32/song?artist=周杰伦"
```

**精确搜索（歌曲名 + 歌手）**:
```bash
curl "http://localhost:3000/api/esp32/song?q=告白气球&artist=周杰伦"
```

### 测试不同音质
```bash
# 标准音质（适合 ESP32）
curl "http://localhost:3000/api/esp32/song?q=稻香&artist=周杰伦&level=standard"

# 较高音质
curl "http://localhost:3000/api/esp32/song?q=稻香&artist=周杰伦&level=higher"
```

### 测试特定歌曲的可用音质
```bash
# 先搜索获取歌曲ID
curl "http://localhost:3000/api/search?q=告白气球&limit=1"

# 使用返回的ID测试各种音质
curl "http://localhost:3000/api/test/song/419594013"
```

---

## ⚠️ 重要说明

### 1. 30秒限制问题

网易云音乐API对未登录用户有以下限制：

- **部分歌曲**：只提供30秒试听
- **VIP歌曲**：需要会员账号
- **版权限制**：部分地区不可用

**解决方案**：
- 尝试不同的音质级别（`standard`, `higher`, `exhigh`）
- 搜索不受版权限制的歌曲
- 多搜索几首歌，选择可用的

### 2. 音质选择建议

对于 ESP32 设备：

| 音质级别 | 比特率 | 带宽需求 | 推荐场景 |
|---------|--------|---------|---------|
| `standard` | ~64-128 kbps | 低 | WiFi不稳定时 |
| `higher` | ~192 kbps | 中 | **推荐** 平衡音质和带宽 |
| `exhigh` | ~320 kbps | 高 | WiFi稳定且音质要求高 |
| `lossless` | ~1000 kbps | 很高 | 不推荐 ESP32 使用 |

### 3. 网络要求

- 确保 ESP32 和服务器在同一网络或可互相访问
- ESP32 需要稳定的 WiFi 连接
- 流式播放需要持续的网络连接

---

## 🔍 故障排查

### 问题：返回 "No playable song found"

**可能原因**：
1. 歌曲受版权保护
2. 需要VIP会员
3. 歌曲已下架

**解决方案**：
```bash
# 1. 尝试不同的搜索关键词
curl "http://localhost:3000/api/esp32/song?q=另一首歌"

# 2. 尝试降低音质
curl "http://localhost:3000/api/esp32/song?q=歌名&level=standard"

# 3. 测试特定歌曲ID的可用性
curl "http://localhost:3000/api/test/song/歌曲ID"
```

### 问题：播放30秒后停止

这通常是网易云API的限制，不是服务器问题。

**可选方案**：
1. 搜索其他歌曲（非VIP、非版权限制的歌曲通常可以完整播放）
2. 尝试不同的音质级别
3. 考虑添加网易云账号Cookie（需要修改代码）

### 问题：ESP32 无法播放

**检查清单**：
1. ✅ URL 是否返回成功？
2. ✅ ESP32 是否能访问返回的音频URL？
3. ✅ Audio 库是否正确初始化？
4. ✅ I2S 引脚配置是否正确？

---

## 📊 性能优化

### ESP32 内存优化

```cpp
// 使用静态缓冲区减少内存分配
StaticJsonDocument<1024> doc;

// 限制搜索结果
String url = String(serverUrl) + "/api/search?q=" + 
             String(query) + "&limit=1";
```

### 预加载策略

```cpp
// 预先搜索多首歌曲，避免播放中断
String playlist[] = {"歌曲1", "歌曲2", "歌曲3"};
int currentSong = 0;

void loop() {
    if (!audio.isRunning()) {
        playSong(playlist[currentSong]);
        currentSong = (currentSong + 1) % 3;
    }
    audio.loop();
}
```

---

## 🚀 高级功能

### 添加播放列表支持

创建一个返回多首歌曲URL的端点：

```cpp
// 请求播放列表
curl "http://localhost:3000/api/search?q=周杰伦&limit=5"

// ESP32 代码中解析多个歌曲并依次播放
```

### 添加歌词显示

```cpp
// 获取歌词
http.begin(String(serverUrl) + "/api/lyric/" + String(songId));
```

---

## 📚 相关资源

- [ESP32-audioI2S 库](https://github.com/schreibfaul1/ESP32-audioI2S)
- [ArduinoJson 库](https://arduinojson.org/)
- [网易云音乐API文档](https://neteasecloudmusicapi-docs.vercel.app/)

---

## 💡 最佳实践

1. **错误处理**：始终检查HTTP响应状态和JSON解析结果
2. **重试机制**：网络失败时自动重试
3. **音质选择**：根据WiFi信号强度动态调整
4. **缓存策略**：缓存常用歌曲的URL（注意URL有效期）

---

## 🐛 已知限制

1. ❌ 部分歌曲只有30秒试听（网易云API限制）
2. ❌ VIP歌曲需要登录Cookie
3. ❌ 地区版权限制
4. ✅ 大部分流行歌曲可以完整播放

---

**如有问题，请提Issue！** 🎵

