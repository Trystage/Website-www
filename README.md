# Trystage 官方网站

欢迎来到 Trystage 官方网站仓库！这是一个纯静态网站，展示了 Trystage 服务器的相关信息。

## 项目简介

Trystage 是一个创新的 Minecraft 服务器，提供独特的游戏体验和社区环境。本网站用于展示服务器信息、新闻动态、项目特色等内容。

## 技术栈

- HTML5
- CSS3
- JavaScript
- 纯静态部署

## 使用方法

由于这是纯静态网站，您可以直接在浏览器中打开 `index.html` 文件来查看网站内容。

### 本地运行

1. 克隆此仓库到本地：
   ```
   git clone https://github.com/Trystage/Website-www.git
   ```

2. 进入项目目录：
   ```
   cd Website-www
   ```

3. 直接用浏览器打开 `index.html` 文件，或者使用本地服务器运行：
   
   使用 Python（需要安装 Python）：
   ```
   python -m http.server 8000
   ```
   
   然后在浏览器中访问 `http://localhost:8000`

### 部署

由于是纯静态网站，可以直接部署到任何支持静态文件托管的服务上，例如：
- GitHub Pages
- Netlify
- Vercel
- 云服务器 nginx/apache

## 项目结构

```
.
├── index.html          # 网站主页
├── styles.css          # 样式文件
├── script.js           # JavaScript 脚本
├── background.png      # 背景图片
├── icon.png            # 网站图标
├── image/              # 图片资源目录(供TrystageBedwarsWiki使用)
└── news/               # 新闻文章目录
    ├── news1.md
    ├── news2.md
    └── news3.md
```

## 功能特性

- 响应式设计，适配各种设备屏幕
- 平滑滚动动画效果
- 新闻动态展示
- 项目介绍页面
- 服务器相关信息展示
- 移动端优化
- 好看()

## 开发指南

如果您想对网站进行修改或二次开发，请遵循以下步骤：

1. 修改 HTML 结构：编辑 `index.html` 文件
2. 调整样式：修改 `styles.css` 文件
3. 添加交互功能：编辑 `script.js` 文件
4. 更新新闻内容：修改 `news/` 目录下的 Markdown 文件

## 贡献

欢迎提交 Issue 或 Pull Request 来帮助我们改进网站。

## 许可证

请查看 [LICENSE](LICENSE) 文件了解详细信息。