# Changelog

## [Unreleased]

### Added
- 🎼 **乐器频道** - 在首页添加乐器频道，包含4个分类共20种乐器
  - 🎵 **流行入门推荐** - Acoustic Guitar、Keyboard、Cajón、Ukulele、Harmonica
  - 🎻 **经典原声乐器** - Violin、Cello、Flute、Piano、Classical Guitar
  - 🥁 **现代乐队必备** - Electric Guitar、Bass Guitar、Drum Set、Synthesizer、Microphone
  - 🌏 **世界民族乐器精选** - Erhu、Djembe、Sitar、Pan Flute、Shamisen
- 🎯 **乐器搜索功能** - 点击乐器卡片自动搜索相关音乐
- ✨ **多主题支持** - 添加了 6 个预设主题（Dark、Light、Blue、Purple、Green、Orange）
- 🎨 **主题切换功能** - 在页面 header 添加主题切换按钮，支持快速切换主题
- 💾 **主题持久化** - 使用 localStorage 保存用户选择的主题，下次访问自动应用
- 📝 **CSS 变量系统** - 重构所有样式文件，使用 CSS 变量实现主题切换
- 📚 **主题文档** - 在 `ai-docs/multi-theme-support.md` 中记录了详细的实现文档

### Changed
- 🔄 **样式重构** - 所有 CSS 文件中的硬编码颜色值替换为 CSS 变量
- 🎯 **Header 布局** - 更新 header 布局，添加主题选择器区域

### Technical Details
- 新增 `public/css/instruments.css` - 乐器频道样式文件
- 新增 `public/js/instruments.js` - 乐器频道模块，包含乐器数据和渲染逻辑
- 更新 `public/index.html` 添加乐器频道 DOM 结构
- 更新 `public/js/dom.js` 添加乐器频道元素引用
- 更新 `public/js/app.js` 初始化乐器频道
- 新增 `public/css/themes.css` - 主题 CSS 变量定义文件
- 新增 `public/js/theme.js` - 主题管理核心模块
- 新增 `public/js/ui-theme.js` - 主题 UI 交互模块
- 更新所有 CSS 文件使用 CSS 变量
- 更新 `public/index.html` 添加主题选择器 HTML 结构

---

## [Previous Versions]

（之前的版本记录...）

