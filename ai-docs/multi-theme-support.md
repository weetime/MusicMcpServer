# 多主题支持功能实现

## 任务概述

为 MusicEcho 音乐播放器添加多主题支持功能，允许用户在多个预设主题之间切换。

## 实现时间

2024年（当前日期）

## 实现内容

### 1. 主题系统架构

#### CSS 变量系统
- 创建了 `themes.css` 文件，定义了完整的 CSS 变量系统
- 使用 CSS 自定义属性（CSS Variables）实现主题切换
- 定义了以下变量类别：
  - 背景颜色（`--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--bg-hover`, `--bg-active`）
  - 文本颜色（`--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-disabled`）
  - 边框颜色（`--border-primary`, `--border-secondary`, `--border-hover`）
  - 强调色（`--accent-primary`, `--accent-hover`, `--accent-active`, `--accent-shadow`）
  - 遮罩颜色（`--overlay-dark`, `--overlay-backdrop`, `--overlay-panel`）
  - 阴影颜色（`--shadow-sm`, `--shadow-md`, `--shadow-lg`）

#### 预设主题
实现了 6 个预设主题：
1. **Dark（深色）** - 默认主题，深色背景
2. **Light（浅色）** - 浅色背景主题
3. **Blue（蓝色）** - 蓝色调主题
4. **Purple（紫色）** - 紫色调主题
5. **Green（绿色）** - 绿色调主题
6. **Orange（橙色）** - 橙色调主题

### 2. JavaScript 模块

#### `theme.js` - 主题管理核心模块
- `themes` - 主题列表数组
- `getCurrentTheme()` - 获取当前主题
- `initTheme()` - 初始化主题系统（从 localStorage 加载）
- `setTheme(themeId)` - 设置主题
- `cycleTheme()` - 循环切换主题
- `getThemeInfo(themeId)` - 获取主题信息
- 使用 localStorage 持久化用户选择的主题

#### `ui-theme.js` - 主题 UI 交互模块
- `initThemeUI()` - 初始化主题 UI
- `renderThemeList()` - 渲染主题列表
- `updateThemeList()` - 更新主题列表状态
- `toggleThemeDropdown()` - 切换主题下拉菜单
- `showThemeDropdown()` / `hideThemeDropdown()` - 显示/隐藏下拉菜单

### 3. UI 组件

#### Header 主题切换按钮
- 在页面 header 右侧添加主题切换按钮
- 点击按钮显示主题选择下拉菜单
- 下拉菜单显示所有可用主题，当前主题高亮显示
- 每个主题显示图标和名称

#### 主题选择下拉菜单
- 响应式设计，适配不同屏幕尺寸
- 点击主题项立即切换主题
- 点击外部区域自动关闭菜单
- 当前主题显示选中标记

### 4. CSS 文件更新

将所有 CSS 文件中的硬编码颜色值替换为 CSS 变量：

- `base.css` - 基础样式
- `header.css` - Header 样式（新增主题选择器样式）
- `search.css` - 搜索栏样式
- `results.css` - 搜索结果样式
- `player.css` - 播放器样式
- `lyrics.css` - 歌词面板样式
- `modal.css` - 模态框样式

### 5. HTML 更新

- 在 `index.html` 的 `<head>` 中添加 `themes.css` 引用（放在最前面）
- 在 header 中添加主题选择器 HTML 结构

### 6. 应用初始化

- 在 `app.js` 中导入并初始化主题系统
- 确保主题系统在页面加载时优先初始化

## 技术细节

### CSS 变量使用方式

```css
/* 定义变量 */
:root {
    --bg-primary: #121212;
    --text-primary: #FFFFFF;
}

/* 使用变量 */
.element {
    background: var(--bg-primary);
    color: var(--text-primary);
}

/* 主题切换 */
[data-theme="light"] {
    --bg-primary: #FFFFFF;
    --text-primary: #000000;
}
```

### 主题切换机制

1. 通过 `document.documentElement.setAttribute('data-theme', themeId)` 设置主题
2. CSS 选择器 `[data-theme="themeId"]` 自动应用对应主题的变量值
3. 所有使用 CSS 变量的元素自动更新颜色

### 持久化存储

- 使用 `localStorage` 存储用户选择的主题
- 键名：`musicEcho_theme`
- 页面加载时自动恢复上次选择的主题

## 文件变更清单

### 新增文件
- `public/css/themes.css` - 主题 CSS 变量定义
- `public/js/theme.js` - 主题管理核心模块
- `public/js/ui-theme.js` - 主题 UI 交互模块
- `ai-docs/multi-theme-support.md` - 本文档

### 修改文件
- `public/index.html` - 添加主题选择器 HTML 和 CSS 引用
- `public/css/base.css` - 使用 CSS 变量
- `public/css/header.css` - 使用 CSS 变量，添加主题选择器样式
- `public/css/search.css` - 使用 CSS 变量
- `public/css/results.css` - 使用 CSS 变量
- `public/css/player.css` - 使用 CSS 变量
- `public/css/lyrics.css` - 使用 CSS 变量
- `public/css/modal.css` - 使用 CSS 变量
- `public/js/app.js` - 初始化主题系统

## 使用方式

1. 点击页面右上角的主题切换按钮（太阳图标）
2. 从下拉菜单中选择想要的主题
3. 主题立即生效，并自动保存到 localStorage
4. 下次访问页面时自动应用上次选择的主题

## 后续优化建议

1. 添加主题预览功能
2. 支持自定义主题（用户自定义颜色）
3. 添加主题过渡动画
4. 支持系统主题自动切换（跟随系统深色/浅色模式）
5. 添加更多预设主题

## 测试要点

- [x] 所有主题可以正常切换
- [x] 主题切换后所有 UI 元素颜色正确更新
- [x] 主题选择持久化（刷新页面后保持）
- [x] 主题下拉菜单交互正常
- [x] 响应式设计在不同屏幕尺寸下正常显示
- [x] 所有 CSS 变量正确应用

## 注意事项

1. CSS 变量需要浏览器支持（现代浏览器都支持）
2. localStorage 可能在某些隐私模式下不可用，需要错误处理
3. 主题切换时所有元素都会重新渲染，可能影响性能（已添加过渡动画优化体验）

