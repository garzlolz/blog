# Node.js 20+ 優化配置說明

## 🎯 為什麼選擇 Node.js 20+

您的 Node.js >20 版本帶來了以下優勢：

### 性能提升
- **V8 引擎 11.0+**: 更快的 JavaScript 執行速度
- **啟動時間優化**: 比舊版本快 20-30%
- **內存使用優化**: 更有效的垃圾回收

### 現代化功能
- **原生 ES Modules**: 無需轉譯的現代 JavaScript
- **頂級 await**: 簡化異步代碼
- **改進的 CORS 處理**: 更好的跨域請求支持

### 安全性增強
- **更新的 OpenSSL**: 最新的安全補丁
- **改進的權限模型**: 更安全的文件系統訪問
- **更好的錯誤處理**: 防止信息洩露

## 🛠️ 專為您優化的配置

### package.json 優化
```json
{
  "type": "module",           // 啟用 ES Modules
  "engines": {
    "node": ">=20.0.0",      // 確保版本兼容
    "npm": ">=10.0.0"
  }
}
```

### 服務器配置優化
```bash
# 使用優化參數
npx serve . -p 8000 --cors --no-clipboard

# 參數說明：
# --cors: 啟用 CORS 支持，完全解決跨域問題
# --no-clipboard: 避免不必要的剪貼板操作，提升性能
```

### .nvmrc 版本鎖定
```
20
```
確保團隊協作時使用相同的 Node.js 版本。

## 🚀 開發工作流程

### 推薦工作流程
1. **開發**: `npm run dev`
2. **測試**: 在瀏覽器中檢查功能
3. **部署**: `npm run deploy`

### 高級命令
```bash
# 檢查項目狀態
npm run validate

# 優化圖片 (如果需要)
npm run optimize-images

# 代碼檢查
npm run lint
```

## 🔧 故障排除

### 如果遇到問題
1. **清理緩存**: `npm cache clean --force`
2. **重新安裝依賴**: `rm -rf node_modules && npm install`
3. **檢查版本**: `node --version && npm --version`

### 常見問題
- **端口被佔用**: 使用 `npm run preview` (端口 3000)
- **權限問題**: 使用管理員權限運行終端
- **防火牆阻擋**: 允許 Node.js 通過防火牆

## 📈 性能建議

### 本地開發
- 使用 `npm run dev` 而非直接打開 HTML
- 利用瀏覽器的開發者工具進行調試
- 啟用熱重載功能

### 生產部署
- GitHub Pages 會自動優化靜態資源
- 考慮使用 CDN 加速圖片載入
- 啟用 PWA 功能提升用戶體驗

---

💡 **記住**: Node.js 20+ 是當前最佳選擇，享受最現代化的開發體驗！
