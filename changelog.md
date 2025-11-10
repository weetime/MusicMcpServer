# Changelog

## [Unreleased]

### Added
- ✨ **多主题支持** - 添加了 6 个预设主题（Dark、Light、Blue、Purple、Green、Orange）
- 🎨 **主题切换功能** - 在页面 header 添加主题切换按钮，支持快速切换主题
- 💾 **主题持久化** - 使用 localStorage 保存用户选择的主题，下次访问自动应用
- 📝 **CSS 变量系统** - 重构所有样式文件，使用 CSS 变量实现主题切换
- 📚 **主题文档** - 在 `ai-docs/multi-theme-support.md` 中记录了详细的实现文档

### Changed
- 🔄 **样式重构** - 所有 CSS 文件中的硬编码颜色值替换为 CSS 变量
- 🎯 **Header 布局** - 更新 header 布局，添加主题选择器区域

### Technical Details
- 新增 `public/css/themes.css` - 主题 CSS 变量定义文件
- 新增 `public/js/theme.js` - 主题管理核心模块
- 新增 `public/js/ui-theme.js` - 主题 UI 交互模块
- 更新所有 CSS 文件使用 CSS 变量
- 更新 `public/index.html` 添加主题选择器 HTML 结构
- 更新 `public/js/app.js` 初始化主题系统

---

## [Previous Versions]

（之前的版本记录...）

