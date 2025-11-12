# MusicEcho 项目文档

## 项目简介

MusicEcho 是一个现代化的音乐搜索和播放服务，基于网易云音乐 API 构建。提供丰富的音乐库访问、强大的搜索功能和在线播放能力。

## 项目架构

### 技术栈

**后端：**
- Node.js
- Express.js
- Axios
- NeteaseCloudMusicApi

**前端：**
- HTML5
- CSS3 (使用 CSS 变量实现主题系统)
- Vanilla JavaScript (ES6+)
- HTML5 Audio API

### 项目结构

```
MusicMcpServer/
├── server.js              # 主服务器入口
├── routes/                # API 路由
│   ├── health.js          # 健康检查路由
│   ├── index.js            # 首页路由
│   └── search.js           # 搜索和播放 API 路由
├── services/               # 服务层
│   └── netease.js          # 网易云音乐服务
├── public/                 # 前端静态文件
│   ├── index.html          # Web 界面（保留作为备份）
│   ├── pc/                 # PC 版本（桌面端）
│   │   ├── index.html      # PC 版本界面
│   │   ├── css/            # PC 专用样式
│   │   ├── js/             # PC 专用脚本
│   │   └── icons/           # 图标资源
│   ├── mobile/             # 移动端版本
│   │   ├── index.html      # 移动端版本界面
│   │   ├── css/            # 移动端专用样式
│   │   ├── js/             # 移动端专用脚本
│   │   └── icons/          # 图标资源
│   ├── css/                # 样式文件（保留作为备份）
│   │   ├── themes.css      # 主题 CSS 变量定义
│   │   ├── base.css        # 基础样式
│   │   ├── header.css      # Header 样式
│   │   ├── search.css      # 搜索栏样式
│   │   ├── results.css      # 搜索结果样式
│   │   ├── player.css       # 播放器样式
│   │   ├── lyrics.css       # 歌词面板样式
│   │   ├── modal.css        # 模态框样式
│   │   ├── instruments.css  # 乐器频道样式
│   │   └── responsive.css  # 响应式样式
│   └── js/                 # JavaScript 模块
│       ├── app.js          # 应用入口
│       ├── dom.js          # DOM 元素引用
│       ├── state.js        # 状态管理
│       ├── theme.js        # 主题管理核心模块
│       ├── ui-theme.js     # 主题 UI 交互模块
│       ├── instruments.js  # 乐器频道模块
│       ├── search.js       # 搜索功能
│       ├── results.js      # 搜索结果处理
│       ├── player.js        # 播放器控制
│       ├── playlist.js      # 播放列表
│       ├── lyrics.js        # 歌词显示
│       ├── history.js       # 搜索历史
│       ├── modal.js         # 模态框
│       ├── pagination.js    # 分页
│       ├── ui.js            # UI 工具
│       └── utils.js         # 工具函数
├── ai-docs/                # AI 开发文档
│   └── multi-theme-support.md  # 多主题支持实现文档
├── package.json            # 项目依赖
├── README.md               # 项目说明
├── changelog.md            # 变更日志
└── allaboutproject.md      # 本文档
```

## 主要功能

### 1. 乐器频道 🎼
- **4 个分类，共 20 种乐器**：
  - 🎵 **流行入门推荐**：Acoustic Guitar（木吉他）、Keyboard（电子琴）、Cajón（卡洪鼓）、Ukulele（尤克里里）、Harmonica（口琴）
  - 🎻 **经典原声乐器**：Violin（小提琴）、Cello（大提琴）、Flute（长笛）、Piano（钢琴）、Classical Guitar（古典吉他）
  - 🥁 **现代乐队必备**：Electric Guitar（电吉他）、Bass Guitar（电贝司）、Drum Set（架子鼓）、Synthesizer（合成器）、Microphone（麦克风）
  - 🌏 **世界民族乐器精选**：Erhu（二胡）、Djembe（非洲手鼓）、Sitar（锡塔尔琴）、Pan Flute（排箫）、Shamisen（三味线）
- **一键搜索**：点击乐器卡片自动搜索相关音乐
- **响应式布局**：适配桌面、平板、移动设备

### 2. 音乐搜索
- 支持按歌曲名、艺术家、专辑搜索
- 支持高级搜索选项（艺术家筛选、音质选择）
- 搜索历史记录功能
- 分页显示搜索结果

### 3. 在线播放
- 支持多种音质（Standard、Higher、Extremely High、Lossless、Hi-Res）
- 播放进度控制
- 音量控制
- 播放/暂停、上一首/下一首
- 播放列表管理

### 4. 歌词显示
- 实时歌词同步显示
- 支持中英文歌词
- 歌词翻译显示
- 全屏歌词面板

### 5. 多主题支持 ✨
- **6 个预设主题**：
  - Dark（深色）- 默认主题
  - Light（浅色）
  - Blue（蓝色）
  - Purple（紫色）
  - Green（绿色）
  - Orange（橙色）
- **主题切换**：点击 header 右侧的主题按钮快速切换
- **主题持久化**：自动保存用户选择的主题
- **CSS 变量系统**：使用 CSS 自定义属性实现主题切换

### 6. PC 和移动端分离 🖥️📱
- **独立版本**：PC 版本和移动端版本完全独立，分别位于 `public/pc/` 和 `public/mobile/` 目录
- **自动设备检测**：访问根路径 `/` 时自动检测设备类型并重定向到对应版本
- **手动访问**：支持通过 `/pc` 和 `/mobile` 路由手动访问不同版本
- **优化体验**：PC 版本针对桌面端优化，移动端版本针对移动设备优化
- **完全独立**：两个版本互不影响，可以独立开发和维护

### 7. 响应式设计 📱
- **移动端版本**：完美适配手机（<768px）、平板（768px-1024px）
- **PC 版本**：优化桌面端体验（≥1024px）
- **自适应布局**：
  - Header：移动端缩小标题、隐藏副标题、调整按钮大小
  - 搜索栏：移动端垂直布局选项、调整输入框大小
  - 结果网格：桌面6列 → 平板4列 → 手机3列 → 小屏2列
  - 播放器：移动端简化控制、隐藏非必要功能（音量、队列等）
  - 乐器网格：桌面5列 → 平板4列 → 手机3列
- **触摸友好**：
  - 优化按钮大小（最小44x44px触摸目标）
  - 增加触摸反馈效果
  - 防止意外水平滚动
  - 优化下拉菜单位置和大小，防止溢出
- **性能优化**：
  - 使用CSS媒体查询实现响应式
  - 避免JavaScript布局计算
  - 优化移动端字体渲染

## API 端点

### Health Check
```
GET /api/health
```
返回服务器状态和可用端点。

### Search Music
```
GET /api/search?q=<query>&limit=<number>
```

**参数：**
- `q` (必需): 搜索关键词
- `limit` (可选): 结果数量 (1-50, 默认: 10)

**示例：**
```bash
curl "http://localhost:3000/api/search?q=周杰伦&limit=10"
```

### Get Song URL
```
GET /api/song-url/:id?level=<quality>
```

**参数：**
- `id` (必需): 歌曲 ID
- `level` (可选): 音质 (standard, higher, exhigh, lossless)

**示例：**
```bash
curl "http://localhost:3000/api/song-url/186001?level=standard"
```

### Get Lyrics
```
GET /api/lyric/:id
```

**参数：**
- `id` (必需): 歌曲 ID

**示例：**
```bash
curl "http://localhost:3000/api/lyric/186001"
```

## 使用方式

### 使用乐器频道

1. 在首页浏览乐器频道，查看 4 个分类共 20 种乐器
2. 点击任意乐器卡片（例如：`Acoustic Guitar`、`二胡`）
3. 系统自动搜索该乐器相关的音乐
4. 浏览搜索结果并播放

### 搜索音乐

1. 在第一个输入框输入歌曲名（例如：`七里香`, `稻香`）
2. 可选：在第二个输入框输入艺术家名（例如：`周杰伦`）
3. 选择音质（默认：Extremely High）
4. 点击 "Search" 按钮或按 Enter
5. 浏览搜索结果

### 播放音乐

1. 点击搜索结果中的任意歌曲
2. 播放器自动打开并开始播放
3. 使用控制按钮：
   - ▶️/⏸️ 播放/暂停
   - 🎚️ 拖动进度条跳转
   - 🔊 调整音量
   - ⏮️/⏭️ 上一首/下一首

### 切换主题

1. 点击页面右上角的主题切换按钮（太阳图标）
2. 从下拉菜单中选择想要的主题
3. 主题立即生效并自动保存

## 配置

### 环境变量

创建 `.env` 文件：

```bash
# 网易云音乐 API 配置
NETEASE_API_URL=http://localhost:4000

# 服务器配置
PORT=3000
NODE_ENV=development
```

## 开发指南

### 本地运行

#### 方式一：分别启动

**终端 1 - 网易云 API 服务：**
```bash
npm run start:netease
```

**终端 2 - MusicMcpServer：**
```bash
npm start
# 或开发模式（自动重载）
npm run dev
```

#### 方式二：一键启动
```bash
npm run start:all
```

### 访问应用

#### 自动设备检测（推荐）

打开浏览器访问：**http://localhost:3000/**

系统会根据设备类型自动重定向：
- **移动设备** → `/mobile/`
- **桌面设备** → `/pc/`

#### 手动访问

- **PC 版本**：http://localhost:3000/pc
- **移动端版本**：http://localhost:3000/mobile

## 主题系统

### CSS 变量

主题系统使用 CSS 自定义属性（CSS Variables）实现。所有颜色值都通过 CSS 变量定义，切换主题时只需更改 `data-theme` 属性即可。

### 可用主题

- `dark` - 深色主题（默认）
- `light` - 浅色主题
- `blue` - 蓝色主题
- `purple` - 紫色主题
- `green` - 绿色主题
- `orange` - 橙色主题

### 主题切换 API

```javascript
import { setTheme, getCurrentTheme, themes } from './js/theme.js';

// 设置主题
setTheme('blue');

// 获取当前主题
const currentTheme = getCurrentTheme();

// 获取所有主题
console.log(themes);
```

## 常见问题

### Q: 没有搜索结果？

**A**: 检查：
1. 网易云 API 服务是否运行（端口 4000）
2. 网络连接是否正常
3. 尝试不同的搜索关键词

### Q: 无法播放歌曲？

**A**: 可能的原因：
1. 歌曲没有播放 URL（版权限制）
2. 网易云 API 限流
3. 网络问题

解决方案：
- 尝试其他歌曲
- 等待片刻后重试
- 检查浏览器控制台错误（F12）

### Q: 主题切换不生效？

**A**: 检查：
1. 浏览器是否支持 CSS 变量（现代浏览器都支持）
2. 检查浏览器控制台是否有错误
3. 清除浏览器缓存后重试

## 部署

### 部署到 Vercel

1. Fork 或推送到 Git 仓库
2. 在 Vercel Dashboard 中导入仓库
3. 设置环境变量：
   - `NETEASE_API_URL`: `https://netease-cloud-music-api-rouge.vercel.app`
   - `NODE_ENV`: `production`
4. 部署

### 公共网易云 API 实例

- https://netease-cloud-music-api-rouge.vercel.app
- https://music-api.heheda.top
- https://netease-api.vercel.app

或部署自己的实例：[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

## 版本历史

详见 [changelog.md](./changelog.md)

## 许可证

ISC

## 致谢

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) - 非官方网易云音乐 API
- [网易云音乐](https://music.163.com/) - 音乐平台

---

**享受音乐！** 🎵✨

