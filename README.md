"# 🌟 Cyberpunk 部落格 | Cyberpunk Blog

一個具有賽博朋克風格的靜態部落格，設計用於 GitHub Pages 部署。擁有 Matrix 雨滴背景動畫、霓虹燈效果和響應式設計。

A cyberpunk-themed static blog designed for GitHub Pages deployment, featuring Matrix rain animation, neon effects, and responsive design.

## ✨ 特色功能 | Features

- � **賽博朋克風格設計** - 霓虹燈效果和科幻感十足的 UI
- �️ **Matrix 雨滴動畫** - 酷炫的背景視覺效果
- 📱 **響應式設計** - 完美支援手機、平板、桌面
- 🔍 **文章分類篩選** - 技術、工作、生活分類
- ⚡ **快速載入** - 純靜態文件，無需後端
- 🚀 **GitHub Pages 就緒** - 一鍵部署到 GitHub Pages

## 🚀 快速開始 | Quick Start

### 本地開發 (推薦使用 Node.js)

既然您有 Node.js，使用以下方式最簡單：

```bash
# 安裝並啟動本地服務器
npx serve . -p 8000

# 或使用 npm scripts
npm run dev

# 或直接執行腳本
# Windows: 雙擊 start-server.bat
# Linux/Mac: ./start-server.sh
```

然後訪問 `http://localhost:8000`

### 部署到 GitHub Pages

```bash
# 1. 推送到 GitHub
git add .
git commit -m "Deploy cyberpunk blog"
git push origin main

# 2. 在 GitHub 倉庫設置中啟用 Pages
# Settings > Pages > Source: main branch
```

## 📁 項目結構 | Project Structure

```
cyberpunk-blog/
├── index.html              # 主頁面
├── blog_posts.json         # 文章數據 (JSON 格式)
├── manifest.json           # PWA 配置
├── package.json            # Node.js 項目配置
├── css/
│   └── style.css          # 賽博朋克樣式
├── js/
│   ├── app.js             # 主要邏輯
│   ├── matrix.js          # Matrix 動畫效果
│   └── blog-data.js       # 備選數據 (CORS 故障安全)
├── images/
│   ├── avatar.jpg         # 頭像
│   └── [年份]/            # 按年份組織的圖片
└── scripts/               # 部署和服務器腳本
```

## 🎯 技術棧 | Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Cyberpunk theme with neon colors
- **Fonts**: Orbitron, Rajdhani (Google Fonts)
- **Icons**: Font Awesome 6.0.0
- **Animation**: CSS keyframes + JavaScript
- **Deployment**: GitHub Pages
- **PWA**: Manifest for app-like experience

## 🔧 自定義 | Customization

### 修改文章內容
編輯 `blog_posts.json` 文件：

```json
{
  "blogPosts": [
    {
      "date": "2024-01-01",
      "title": "文章標題",
      "content": "文章內容...",
      "category": "技術",
      "images": ["path/to/image.jpg"]
    }
  ]
}
```

### 修改視覺風格
編輯 `css/style.css` 中的 CSS 變數：

```css
:root {
    --neon-green: #00ff41;    /* 霓虹綠 */
    --neon-pink: #ff0080;     /* 霓虹粉 */
    --neon-blue: #00d4ff;     /* 霓虹藍 */
    --dark-bg: #0a0a0a;       /* 深色背景 */
}
```

## 📝 添加新文章 | Adding New Posts

1. 在 `blog_posts.json` 中添加新條目
2. 如果有圖片，上傳到 `images/[年份]/` 目錄
3. 推送到 GitHub，自動部署

## 🐛 故障排除 | Troubleshooting

### CORS 錯誤
- **問題**: 直接打開 HTML 文件看到 CORS 錯誤
- **解決**: 使用本地服務器 (`npx serve . -p 8000`) 或部署到 GitHub Pages
- **說明**: 這是瀏覽器安全政策，部署後自動解決

### 圖片不顯示
- 檢查圖片路徑是否正確
- 確保圖片文件存在於 `images/` 目錄中

### Matrix 動畫卡頓
- 在低性能設備上可以修改 `js/matrix.js` 中的動畫參數
- 減少雨滴數量或降低更新頻率

## 🎮 開發命令 | Development Commands

```bash
# 本地開發
npm run dev              # 啟動開發服務器
npm start               # 同上 (alias)

# 部署
npm run deploy          # 部署到 gh-pages (需安裝 gh-pages)

# 服務器
./start-server.sh       # Unix 系統
start-server.bat        # Windows 系統
```

## 📄 授權 | License

MIT License - 可自由使用和修改

## 🤝 貢獻 | Contributing

歡迎提交 Issue 和 Pull Request！

---

**💡 提示**: 這個部落格專為 GitHub Pages 設計，支援 PWA 功能，可以像原生應用一樣安裝到設備上。" 
 https://garzlolz.github.io/blog/
