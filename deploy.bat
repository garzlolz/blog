@echo off
:: Cyberpunk Blog 快速部署腳本 (Windows)
:: 運行此腳本將自動設置 Git 並推送到 GitHub

echo 🚀 開始部署 Cyberpunk Blog...

:: 檢查是否已初始化 Git
if not exist ".git" (
    echo 📦 初始化 Git 倉庫...
    git init
    git branch -M main
) else (
    echo ✅ Git 倉庫已存在
)

:: 添加所有文件
echo 📁 添加文件到 Git...
git add .

:: 提交更改
echo 💾 提交更改...
set /p commit_message="請輸入提交訊息 (預設: Deploy cyberpunk blog): "
if "%commit_message%"=="" set commit_message=Deploy cyberpunk blog
git commit -m "%commit_message%"

:: 檢查遠程倉庫
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 設置遠程倉庫...
    set /p repo_url="請輸入 GitHub 倉庫 URL (例: https://github.com/garzlolz/blog.git): "
    git remote add origin "%repo_url%"
) else (
    echo ✅ 遠程倉庫已設置
)

:: 推送到 GitHub
echo 🌐 推送到 GitHub...
git push -u origin main

echo.
echo 🎉 部署完成！
echo 📍 請在 GitHub 倉庫設置中啟用 Pages 功能
echo 🔧 設置路徑: Settings ^> Pages ^> Source: Deploy from a branch ^> Branch: main
echo ⏳ 部署通常需要 5-10 分鐘
echo 🌟 完成後可在 https://yourusername.github.io/blog 訪問您的部落格

pause
