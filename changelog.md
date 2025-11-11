# Changelog

## [Unreleased]

### Added
- 🔒 **安全性改进** - 修复 innerHTML XSS 风险，使用 DOM API 替代
  - 修复 `modal.js` 中的 innerHTML 使用，改用 DOM API
  - 修复 `instruments.js` 中的 innerHTML 使用，改用 DOM API
  - 修复 `ui-theme.js` 中的 innerHTML 使用，改用 DOM API
- ♿ **可访问性改进** - 添加 ARIA 标签和键盘导航支持
  - 为所有交互元素添加 `aria-label`、`aria-expanded`、`aria-haspopup` 等属性
  - 为下拉菜单添加 `role="menu"` 和 `role="menuitem"`
  - 为模态框添加 `role="dialog"` 和 `aria-modal="true"`
  - 实现键盘导航支持（Enter、Space、Esc 键）
  - 实现焦点管理（模态框打开时聚焦，关闭时恢复焦点）
- 📋 **前端规范检查** - 完成全面的前端规范审查
  - 创建 `ai-docs/frontend-standards-audit.md` 规范检查报告
  - 识别并修复安全性、可访问性、性能等方面的问题
  - 提供改进建议和优先级路线图

### Changed
- 📱 **全面响应式优化** - 优化整个项目的移动端显示，支持手机、平板和桌面设备
  - 移动端Header优化 - 缩小标题、隐藏副标题、调整按钮布局
  - 移动端搜索栏优化 - 调整布局、间距和输入框大小
  - 移动端结果网格优化 - 平板4列、手机3列、小屏2列布局
  - 移动端播放器优化 - 简化控制按钮、隐藏非必要功能、调整布局
  - 移动端下拉菜单优化 - 防止溢出、调整位置和大小
  - 触摸友好优化 - 增加触摸反馈、优化按钮大小
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
- 📱 **响应式设计重构** - 全面优化移动端显示，修复手机端显示异常问题
  - 重构 `responsive.css` - 简化为全局响应式工具类
  - 优化各模块CSS文件 - 在每个模块中添加对应的响应式样式
  - 优化容器和间距 - 调整移动端padding和布局
  - 优化结果网格 - 从固定6列改为响应式2-4列布局
  - 优化播放器 - 移动端隐藏非必要功能，简化控制界面
  - 🔧 **修复移动端网格布局问题** - 修复结果网格在移动端仍显示为水平滚动的问题
    - 移动端改为垂直布局（grid-auto-flow: row）
    - 移除移动端水平滚动，改为垂直滚动
    - 隐藏移动端导航按钮（使用垂直滚动代替）
    - 修复卡片宽度自适应问题
    - 添加全局防溢出样式
  - 🐛 **修复移动端显示问题** - 修复4个关键移动端显示问题
    - 修复搜索框被头部遮住的问题（调整header高度和搜索框位置）
    - 修复乐器弹窗响应式问题（移动端使用fixed定位居中显示）
    - 修复搜索框遮住搜索结果统计的问题（增加container padding-top）
    - 修复分页不显示的问题（添加pagination-container到HTML和dom.js）

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
- 更新 `public/css/base.css` - 添加响应式容器和body样式
- 更新 `public/css/header.css` - 添加移动端Header响应式样式
- 更新 `public/css/search.css` - 添加移动端搜索栏响应式样式
- 更新 `public/css/results.css` - 添加移动端结果网格响应式样式（2-4列布局）
- 更新 `public/css/player.css` - 添加移动端播放器响应式样式
- 更新 `public/css/instruments.css` - 优化移动端乐器网格布局（3-4列）
- 更新 `public/css/responsive.css` - 重构为全局响应式工具类，添加防溢出样式
- 修复 `public/css/results.css` - 修复移动端网格布局，改为垂直布局，移除水平滚动
- 修复 `public/css/header.css` - 调整移动端header高度，修复乐器弹窗响应式定位
- 修复 `public/css/search.css` - 调整移动端搜索框top位置，避免被header遮住
- 修复 `public/css/base.css` - 增加移动端container padding-top，确保搜索结果可见
- 修复 `public/css/instruments.css` - 优化移动端乐器弹窗定位，使用fixed居中显示
- 更新 `public/index.html` - 添加pagination-container元素和pagination.css链接
- 更新 `public/js/dom.js` - 添加paginationContainer元素引用

---

## [Previous Versions]

（之前的版本记录...）

