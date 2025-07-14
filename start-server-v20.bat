@echo off
chcp 65001 >nul
echo ========================================
echo   🚀 Cyberpunk Blog - Local Server
echo ========================================
echo.

:: Check Node.js version
echo 🔍 檢查 Node.js 安裝狀態...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js，嘗試使用 Python...
    goto :python_fallback
)

echo ✅ 發現 Node.js!
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    版本: %NODE_VERSION%

:: Extract major version number (remove 'v' and get first number)
set "VERSION_NUM=%NODE_VERSION:v=%"
for /f "tokens=1 delims=." %%a in ("%VERSION_NUM%") do set MAJOR_VERSION=%%a

:: Check if version >= 20
if %MAJOR_VERSION% geq 20 (
    echo ✨ 太棒了! Node.js 20+ 已檢測到 - 使用優化設置
    echo.
    echo 🌐 啟動具有 CORS 支持的服務器...
    echo 📍 服務器地址: http://localhost:8000
    echo 💡 按 Ctrl+C 停止服務器
    echo.
    start http://localhost:8000
    npx serve . -p 8000 --cors --no-clipboard
) else (
    echo ⚠️  Node.js 版本低於 20，使用基本 serve
    echo.
    echo 🌐 啟動服務器...
    echo 📍 服務器地址: http://localhost:8000
    echo.
    start http://localhost:8000
    npx serve . -p 8000
)
goto :eof

:python_fallback
:: 檢查 Python 是否安裝
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Python，請安裝 Node.js 或 Python
    echo.
    echo 💡 推薦安裝 Node.js 20+: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ 發現 Python，啟動服務器...
echo 📍 服務器地址: http://localhost:8000
echo 🛑 按 Ctrl+C 停止服務器
echo.

start http://localhost:8000
python -m http.server 8000

pause
