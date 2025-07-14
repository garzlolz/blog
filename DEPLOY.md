# 部署指南

## 方法一：直接部署到 GitHub Pages

1. **創建 GitHub 倉庫**
   ```bash
   # 在 GitHub 上創建新倉庫名為 "blog"
   ```

2. **初始化本地 Git 倉庫**
   ```bash
   cd c:\Users\TPP07309\Desktop\ewq
   git init
   git add .
   git commit -m "Initial commit: Cyberpunk blog setup"
   ```

3. **連接遠程倉庫並推送**
   ```bash
   git branch -M main
   git remote add origin https://github.com/garzlolz/blog.git
   git push -u origin main
   ```

4. **啟用 GitHub Pages**
   - 進入 GitHub 倉庫頁面
   - 點擊 Settings
   - 滾動到 Pages 區塊
   - Source 選擇 "Deploy from a branch"
   - Branch 選擇 "main"
   - 文件夾選擇 "/ (root)"
   - 點擊 Save

5. **等待部署完成**
   - 通常需要 5-10 分鐘
   - 部署完成後可在 `https://garzlolz.github.io/blog` 訪問

## 方法二：使用 GitHub Actions 自動部署

如果需要更進階的部署流程，可以創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 自定義域名 (可選)

1. **購買域名**
   - 例如：garz.dev

2. **設置 DNS**
   - 添加 CNAME 記錄指向 `garzlolz.github.io`

3. **在 GitHub 倉庫中設置**
   - 在 Settings > Pages 中添加自定義域名
   - 啟用 "Enforce HTTPS"

4. **創建 CNAME 文件**
   ```bash
   echo "garz.dev" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

## 性能優化建議

1. **圖片優化**
   - 壓縮圖片文件大小
   - 使用 WebP 格式（現代瀏覽器）
   - 添加圖片懶加載

2. **CSS/JS 壓縮**
   - 使用構建工具壓縮文件
   - 移除未使用的 CSS

3. **啟用 Service Worker**
   - 添加離線支持
   - 緩存靜態資源

## 問題排除

### 常見問題

1. **頁面顯示 404**
   - 檢查 GitHub Pages 是否已啟用
   - 確認文件結構正確
   - 等待幾分鐘讓部署完成

2. **圖片無法顯示**
   - 檢查圖片路徑是否正確
   - 確認圖片文件已推送到倉庫

3. **CSS/JS 無法加載**
   - 檢查文件路徑
   - 確認文件編碼為 UTF-8

### 測試建議

1. **本地測試**
   ```bash
   # 使用 Python 簡單服務器
   python -m http.server 8000
   
   # 或使用 Node.js
   npx serve .
   ```

2. **移動端測試**
   - 使用瀏覽器開發者工具
   - 測試不同螢幕尺寸

3. **性能測試**
   - 使用 Google PageSpeed Insights
   - 使用 Lighthouse 工具

## 維護建議

1. **定期備份**
   - 定期提交代碼到 Git
   - 備份圖片資源

2. **內容更新**
   - 定期添加新文章
   - 更新技術資訊

3. **安全性**
   - 定期檢查依賴項
   - 避免在代碼中暴露敏感信息
