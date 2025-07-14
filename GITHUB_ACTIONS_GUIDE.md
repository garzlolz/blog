# 🎯 GitHub Actions 初學者指南

## 什麼是 GitHub Actions？

GitHub Actions 是 GitHub 提供的自動化工具，可以幫您：
- 🚀 **自動部署** - 推送代碼時自動發布到 GitHub Pages
- 🔍 **代碼檢查** - 自動檢查 HTML、JSON 格式是否正確
- 🛡️ **品質控制** - 確保每次更新都不會破壞網站
- ⚡ **省時省力** - 不用手動操作，推送即部署

## 📁 我們為您設置的文件結構

```
.github/
└── workflows/
    └── deploy.yml    # 自動部署配置文件
```

## 🎮 如何使用 GitHub Actions

### 第一次設置 (只需要做一次)

1. **推送配置文件到 GitHub**
```bash
git add .github/
git commit -m "Add GitHub Actions auto-deploy"
git push origin main
```

2. **在 GitHub 倉庫中啟用 Pages**
   - 去您的 GitHub 倉庫 (https://github.com/garzlolz/blog)
   - 點擊 `Settings` (設置)
   - 左側選單找到 `Pages`
   - Source 選擇 `GitHub Actions`
   - 保存設置

### 日常使用 (超簡單！)

從現在開始，您只需要：

```bash
# 1. 修改您的部落格內容
# 2. 推送到 GitHub
git add .
git commit -m "更新部落格內容"
git push origin main

# 3. 等待 2-3 分鐘，網站自動更新！
```

## 🎯 Actions 工作流程說明

我們設置的自動化流程分為三個階段：

### 1️⃣ 驗證階段 (Validate)
- ✅ 檢查 HTML 語法是否正確
- ✅ 驗證 `blog_posts.json` 格式
- ✅ 確保 Node.js 20+ 環境

### 2️⃣ 部署階段 (Deploy)
- 🚀 自動部署到 GitHub Pages
- 🎨 優化靜態資源
- 📤 上傳所有文件到服務器

### 3️⃣ 檢查階段 (Post-Deploy)
- 🔍 確認網站是否正常運行
- 📡 檢查網站可訪問性

## 📊 如何查看 Actions 執行狀態

1. **在 GitHub 倉庫中**：
   - 點擊 `Actions` 標籤
   - 看到綠色 ✅ = 成功
   - 看到紅色 ❌ = 失敗 (會有詳細錯誤信息)

2. **在 VS Code 中**：
   - 可以安裝 GitHub Actions 插件
   - 直接在編輯器中查看狀態

## 🎨 自定義 Actions (進階)

如果您想修改自動化流程，可以編輯 `.github/workflows/deploy.yml`：

```yaml
# 例如：添加自動優化圖片
- name: 🖼️ 優化圖片
  run: |
    npm install -g imagemin-cli
    imagemin images/**/*.{jpg,png} --out-dir=images/optimized
```

## 🔧 常見問題解決

### 問題 1：Actions 失敗了怎麼辦？
1. 點擊 GitHub 的 Actions 標籤
2. 點擊失敗的工作流程
3. 查看紅色的錯誤信息
4. 根據錯誤修復代碼

### 問題 2：網站沒有更新
1. 檢查 Actions 是否成功執行
2. 等待 5-10 分鐘 (GitHub 有時會延遲)
3. 清除瀏覽器緩存

### 問題 3：想暫停自動部署
```bash
# 重命名文件來暫時禁用
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.disabled
```

## 🎉 好處總結

使用 GitHub Actions 後，您將享受：

✅ **完全自動化** - 推送即部署，無需手動操作  
✅ **錯誤預防** - 自動檢查，避免發布錯誤內容  
✅ **專業感** - 像大公司一樣的 CI/CD 流程  
✅ **時間節省** - 專注寫文章，不用擔心部署  
✅ **版本控制** - 每次部署都有記錄  

---

💡 **重要提醒**: 第一次設置後，您只需要專注於寫文章和推送代碼，其他一切都會自動處理！
