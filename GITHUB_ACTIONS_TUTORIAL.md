# 🚀 GitHub Actions 快速實戰教學

## 🎯 什麼是 GitHub Actions？

簡單來說，GitHub Actions 就像您的**自動助手**：
- 📝 您寫文章、修改代碼
- 💾 推送到 GitHub
- 🤖 GitHub Actions 自動幫您部署網站
- ✨ 幾分鐘後，新內容就上線了！

## 📋 第一次設置步驟 (跟著做就對了)

### 步驟 1: 推送 Actions 配置到 GitHub

```bash
# 在您的項目目錄執行 (c:\Users\TPP07309\Desktop\ewq)
git add .github/
git commit -m "🤖 Add GitHub Actions auto-deploy"
git push origin main
```

### 步驟 2: 在 GitHub 網站上啟用 Pages

1. **打開您的 GitHub 倉庫**
   - 網址：https://github.com/garzlolz/blog

2. **點擊 Settings (設置)**
   - 在倉庫頁面頂部的標籤欄

3. **找到 Pages 選項**
   - 在左側選單中，往下滾動找到 "Pages"

4. **更改 Source 設置**
   - 原本可能是 "Deploy from a branch"
   - **改成** "GitHub Actions" ⬅️ 這很重要！

5. **保存設置**
   - GitHub 會顯示您的網站網址：`https://garzlolz.github.io/blog`

### 步驟 3: 測試自動部署

```bash
# 做一個小改動測試
echo "<!-- GitHub Actions test -->" >> index.html
git add .
git commit -m "🧪 Test GitHub Actions deployment"
git push origin main
```

**然後觀察魔法發生：**
1. 去 GitHub 倉庫，點擊 "Actions" 標籤
2. 您會看到一個正在執行的工作流程 🟡
3. 等待變成綠色 ✅ (大約 2-3 分鐘)
4. 您的網站就自動更新了！

## 🎮 日常使用流程 (超級簡單)

從現在開始，每次更新部落格：

```bash
# 1. 編輯您的內容 (例如修改 blog_posts.json)
# 2. 推送到 GitHub
git add .
git commit -m "📝 新增文章: [文章標題]"
git push origin main

# 3. 等待 2-3 分鐘，網站自動更新！
# 不需要其他任何操作 🎉
```

## 📊 如何查看部署狀態

### 在 GitHub 網站上：
1. 去您的倉庫：https://github.com/garzlolz/blog
2. 點擊 "Actions" 標籤
3. 看到：
   - 🟡 黃色圓圈 = 正在執行
   - ✅ 綠色勾勾 = 成功
   - ❌ 紅色叉叉 = 失敗 (會告訴您哪裡有問題)

### 在 VS Code 中：
- 底部狀態欄會顯示 git 狀態
- 可以安裝 "GitHub Actions" 插件來直接查看

## 🎯 我們設置的自動化做了什麼？

### 第1階段：檢查代碼品質 🔍
```
✅ 檢查 HTML 語法是否正確
✅ 驗證 blog_posts.json 格式
✅ 確保 Node.js 20+ 環境
✅ 檢查所有必要文件是否存在
```

### 第2階段：自動部署 🚀
```
📦 下載您的代碼
🛠️ 準備部署文件
🎨 優化靜態資源
📤 上傳到 GitHub Pages 服務器
🌐 啟動新版本網站
```

### 第3階段：部署後檢查 🔍
```
🕐 等待服務器完全啟動
📡 檢查網站是否可以正常訪問
✅ 確認部署成功
```

## 🛠️ 實用指令

```bash
# 查看當前 git 狀態
git status

# 查看提交歷史
git log --oneline -5

# 強制推送 (小心使用)
git push origin main --force

# 查看遠程倉庫
git remote -v
```

## 🐛 故障排除

### ❌ Actions 失敗了？
1. **查看錯誤信息**
   - GitHub → Actions → 點擊失敗的工作流程
   - 點擊紅色的步驟查看詳細錯誤

2. **常見錯誤**
   ```
   🔍 JSON 格式錯誤 → 檢查 blog_posts.json 語法
   🔍 HTML 錯誤 → 檢查 index.html 標籤是否正確
   🔍 權限問題 → 確認 Pages 設置為 "GitHub Actions"
   ```

### 🌐 網站沒更新？
1. **等待時間** - 有時需要 5-10 分鐘
2. **清除瀏覽器緩存** - Ctrl+F5 強制重新載入
3. **檢查 Actions 狀態** - 確認是綠色 ✅

### 🚫 想暫停自動部署？
```bash
# 重命名配置文件來暫時禁用
git mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
git commit -m "🛑 Temporarily disable auto-deploy"
git push origin main
```

## 🎉 成功的標誌

當一切設置正確時，您會看到：
- ✅ GitHub Actions 標籤有綠色勾勾
- 🌐 網站 https://garzlolz.github.io/blog 顯示最新內容
- 📱 可以把網站安裝為 PWA 應用
- ⚡ 每次推送後 2-3 分鐘內網站自動更新

---

💡 **重要提醒**: 設置完成後，您只需要專注於創作內容，技術部分完全自動化！

🎯 **下一步**: 嘗試修改 `blog_posts.json` 添加一篇新文章，然後推送到 GitHub 看看魔法效果！
