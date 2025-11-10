# 🍪 网易云音乐 Cookie 配置指南

通过配置网易云音乐账号的 Cookie，你可以：
- ✅ 获取完整歌曲播放（解决30秒限制）
- ✅ 访问 VIP 歌曲（如果你有会员）
- ✅ 更高的 API 调用限制
- ✅ 更好的搜索结果

---

## 📋 方法一：通过浏览器获取 Cookie（推荐）

### Chrome / Edge 浏览器

1. **登录网易云音乐**
   - 访问 https://music.163.com
   - 点击右上角登录你的账号

2. **打开开发者工具**
   - 按 `F12` 键（或右键 → 检查）
   - 或 菜单 → 更多工具 → 开发者工具

3. **获取 Cookie**
   - 点击 `Application` 标签（应用程序）
   - 左侧展开 `Cookies` → 点击 `https://music.163.com`
   - 找到并复制以下重要的 Cookie 值：

   | Cookie 名称 | 说明 | 必需 |
   |------------|------|------|
   | `MUSIC_U` | 用户认证token | ✅ 是 |
   | `__csrf` | CSRF token | ✅ 是 |
   | `NMTID` | 设备ID | ⚠️ 推荐 |

4. **格式化 Cookie 字符串**

   方式 A - 复制全部（简单）：
   - 在 Chrome DevTools 中，右键点击任一 Cookie
   - 选择 "Show Requests Cookies" 或查看 Network 标签
   - 复制完整的 Cookie 头部

   方式 B - 手动组合（精确）：
   ```
   MUSIC_U=你的MUSIC_U值; __csrf=你的csrf值; NMTID=你的NMTID值
   ```

### Firefox 浏览器

1. 访问 https://music.163.com 并登录
2. 按 `F12` 打开开发者工具
3. 点击 `存储` 标签
4. 展开 `Cookie` → `https://music.163.com`
5. 找到并复制 `MUSIC_U` 和 `__csrf` 的值

---

## 🔧 方法二：使用浏览器扩展

### Chrome/Edge - EditThisCookie

1. 安装 [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie)
2. 访问 https://music.163.com 并登录
3. 点击扩展图标
4. 点击 "Export" 导出 Cookie
5. 复制导出的 Cookie 字符串

---

## ⚙️ 配置到项目中

### 步骤 1: 创建 .env 文件

在项目根目录创建 `.env` 文件（如果不存在）：

```bash
cd /Users/fangyong/agent/MusicMcpServer
cp .env.example .env
```

### 步骤 2: 编辑 .env 文件

打开 `.env` 文件，添加你的 Cookie：

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Netease API Configuration
NETEASE_API_URL=http://localhost:4000

# 🍪 添加你的 Cookie（重要！）
NETEASE_COOKIE=MUSIC_U=你的值; __csrf=你的值; NMTID=你的值
```

**示例**：
```env
NETEASE_COOKIE=MUSIC_U=ABC123XYZ789; __csrf=DEF456UVW012; NMTID=GHI789RST345
```

### 步骤 3: 重启服务器

```bash
npm start
```

### 步骤 4: 验证配置

访问健康检查端点：
```bash
curl http://localhost:3000/api/health
```

**成功响应示例**：
```json
{
  "message": "MusicMcpServer API is running",
  "version": "2.0.0",
  "source": "Netease Cloud Music",
  "cookie_configured": true,
  "login_status": {
    "logged_in": true,
    "user_id": 123456789,
    "nickname": "你的昵称",
    "vip_type": 0
  },
  "endpoints": { ... }
}
```

如果 `cookie_configured: true` 且 `login_status` 显示正确信息，说明配置成功！✅

---

## 🧪 测试 Cookie 是否有效

### 测试 1: 搜索歌曲
```bash
curl "http://localhost:3000/api/search?q=周杰伦&limit=5"
```

### 测试 2: 获取歌曲 URL
```bash
# 先搜索获取歌曲ID
curl "http://localhost:3000/api/search?q=告白气球&limit=1"

# 使用返回的ID测试
curl "http://localhost:3000/api/song-url/419594013?level=exhigh"
```

### 测试 3: 使用测试端点检查各音质
```bash
curl "http://localhost:3000/api/test/song/419594013"
```

**预期结果**：
- ✅ 更多音质级别可用（`exhigh`, `lossless` 等）
- ✅ 返回完整歌曲 URL（不是30秒预览）
- ✅ VIP 歌曲也可以访问（如果你有会员）

---

## 🔒 安全注意事项

### ⚠️ 重要警告

1. **Cookie 是敏感信息**
   - 不要分享你的 Cookie
   - 不要提交到 Git 仓库
   - `.env` 文件已在 `.gitignore` 中排除

2. **Cookie 有效期**
   - Cookie 会过期（通常几周到几个月）
   - 过期后需要重新获取
   - 如果登出账号，Cookie 会立即失效

3. **账号安全**
   - 使用自己的账号
   - 不要使用他人的 Cookie
   - 定期更换密码

### 🛡️ 保护你的 Cookie

**.gitignore 检查**：
确保 `.gitignore` 包含：
```
.env
.env.local
```

**环境变量优先级**：
1. 系统环境变量（最安全）
2. `.env` 文件
3. 不配置（默认，公共API）

---

## 🔄 Cookie 过期后怎么办

### 症状
- API 返回 301 或 401 错误
- 歌曲又变成30秒限制
- `login_status` 显示 `null`

### 解决方案
1. 重新登录 https://music.163.com
2. 获取新的 Cookie
3. 更新 `.env` 文件中的 `NETEASE_COOKIE`
4. 重启服务器

---

## 💡 高级配置

### 使用系统环境变量（生产环境推荐）

**Linux/macOS**:
```bash
export NETEASE_COOKIE="MUSIC_U=xxx; __csrf=xxx; NMTID=xxx"
npm start
```

**Windows PowerShell**:
```powershell
$env:NETEASE_COOKIE="MUSIC_U=xxx; __csrf=xxx; NMTID=xxx"
npm start
```

**Windows CMD**:
```cmd
set NETEASE_COOKIE=MUSIC_U=xxx; __csrf=xxx; NMTID=xxx
npm start
```

### Docker 部署

```dockerfile
# Dockerfile
ENV NETEASE_COOKIE=""

# 或使用 docker-compose.yml
version: '3'
services:
  music-server:
    environment:
      - NETEASE_COOKIE=${NETEASE_COOKIE}
```

---

## 🐛 故障排查

### 问题 1: Cookie 不生效

**检查清单**：
- ✅ Cookie 格式正确（使用分号和空格分隔）
- ✅ 包含 `MUSIC_U` 和 `__csrf`
- ✅ 没有多余的引号或换行
- ✅ 服务器已重启

**验证方法**：
```bash
# 检查环境变量是否加载
curl http://localhost:3000/api/health
# 查看 cookie_configured 字段
```

### 问题 2: 仍然只有30秒

**可能原因**：
1. Cookie 已过期 → 重新获取
2. 歌曲仍然受版权限制 → 尝试其他歌曲
3. 需要 VIP 但你不是会员 → 尝试非VIP歌曲

**测试命令**：
```bash
# 测试不同音质的可用性
curl "http://localhost:3000/api/test/song/歌曲ID"
```

### 问题 3: 登录状态显示 null

**解决方案**：
1. 确认 Cookie 包含 `MUSIC_U`
2. 检查 Cookie 是否正确复制（无空格、无换行）
3. 尝试重新登录并获取新 Cookie

---

## 📊 效果对比

### 未配置 Cookie
```json
{
  "cookie_configured": false,
  "login_status": null
}
```
- ❌ 部分歌曲30秒限制
- ❌ VIP歌曲无法访问
- ⚠️ 较低的API限制

### 已配置 Cookie
```json
{
  "cookie_configured": true,
  "login_status": {
    "logged_in": true,
    "nickname": "你的昵称",
    "vip_type": 11
  }
}
```
- ✅ 大部分歌曲完整播放
- ✅ VIP歌曲可访问（如果有会员）
- ✅ 更高的API限制
- ✅ 更好的搜索质量

---

## 🎯 最佳实践

1. **开发环境**：使用 `.env` 文件
2. **生产环境**：使用系统环境变量或密钥管理服务
3. **团队协作**：每个人使用自己的 Cookie
4. **定期更新**：每月检查并更新 Cookie
5. **备份方案**：如果 Cookie 失效，有降级方案（无 Cookie 模式）

---

## 📞 获取帮助

如果遇到问题：

1. 检查服务器日志
2. 验证 Cookie 格式
3. 测试健康检查端点
4. 查看本文档的故障排查部分

---

**配置成功后，享受完整的音乐播放体验！** 🎵✨

