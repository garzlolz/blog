# 🚀 快速開始指南

## 🎯 Node.js 20+ 優化版本 (您的配置)

恭喜！您的 Node.js >20 版本是最佳選擇，我們為您提供了優化配置：

### 🌟 推薦方式 (Node.js 20+ 最佳實踐)

```bash
# 方法一：使用優化的 npm scripts (推薦)
npm run dev

# 方法二：直接使用 npx with 優化參數
npx serve . -p 8000 --cors --no-clipboard

# 方法三：使用專為 Node.js 20+ 優化的腳本
# Windows: 雙擊 start-server-v20.bat
```

### 🎮 可用的 npm 命令

```bash
npm run dev          # 開發模式 (推薦)
npm start           # 同 dev (別名)
npm run preview     # 預覽模式 (端口 3000)
npm run deploy      # 部署到 GitHub Pages
npm run lint        # 檢查 HTML 語法
npm run validate    # 驗證 HTML 結構
```

然後在瀏覽器中訪問 `http://localhost:8000`

## ✨ Node.js 20+ 的優勢

- **✅ 原生 CORS 支持** - 完全解決跨域問題
- **✅ 更快的啟動速度** - 利用最新 V8 引擎
- **✅ 更好的錯誤處理** - 現代化錯誤報告
- **✅ ES Modules 支持** - 現代 JavaScript 語法
- **✅ 內建性能優化** - 自動壓縮和緩存

## 🚀 部署到 GitHub Pages

### 快速部署
```bash
# 1. 初始化 Git (如果還沒有)
git init
git add .
git commit -m "Initial commit: Cyberpunk blog with Node.js 20+ optimization"

# 2. 連接到 GitHub 倉庫
git remote add origin https://github.com/garzlolz/blog.git
git branch -M main
git push -u origin main

# 3. 在 GitHub 倉庫設置中啟用 Pages
# Settings > Pages > Source: Deploy from a branch > Branch: main
```

### 使用 npm 自動部署
```bash
# 一鍵部署到 gh-pages 分支
npm run deploy
```

## 🔧 Node.js 20+ 專用功能

### 項目配置文件
- ✅ `.nvmrc` - 鎖定 Node.js 版本 20
- ✅ `package.json` - 包含 `engines` 字段確保版本兼容
- ✅ `type: "module"` - 啟用 ES Modules
- ✅ 優化的 browserslist 配置

### 開發工具
```bash
# 版本檢查
node --version

# 項目資訊
npm list

# 依賴檢查
npm audit

# 清理緩存 (如果需要)
npm cache clean --force
```

## 🐛 故障排除

### CORS 錯誤已完全解決
使用 Node.js 20+ 的 `--cors` 參數，CORS 問題已經完全消失！

### 性能優化
- **快速重載**: `--no-clipboard` 參數避免不必要的剪貼板操作
- **智能緩存**: 利用 Node.js 20+ 的改進緩存機制
- **更快啟動**: 新版本 V8 引擎帶來的性能提升

### 版本驗證
```bash
# 確認 Node.js 版本
node --version  # 應該顯示 v20.x.x 或更高

# 確認 npm 版本
npm --version   # 應該顯示 10.x.x 或更高
```

## 🎯 下一步

1. **✅ 立即開始**: `npm run dev`
2. **🎨 自定義內容**: 編輯 `blog_posts.json`
3. **🚀 部署**: `npm run deploy`
4. **📱 PWA 安裝**: 部署後可以安裝為應用

---

💡 **專業提示**: Node.js 20+ 讓您的開發體驗達到最佳狀態，享受最快的本地開發和零 CORS 問題！
