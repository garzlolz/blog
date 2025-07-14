@echo off
echo 🚀 啟動本地開發服務器...
echo.

:: 檢查 Node.js 是否安裝
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Node.js，嘗試使用 Python...
    goto :python_fallback
)

echo ✅ 發現 Node.js，使用 npx serve...
echo � 服務器地址: http://localhost:8000
echo 🛑 按 Ctrl+C 停止服務器
echo.

start http://localhost:8000
npx serve . -p 8000
goto :eof

:python_fallback
:: 檢查 Python 是否安裝
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未找到 Python，請安裝 Node.js 或 Python
    echo.
    echo 💡 推薦安裝 Node.js: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ 發現 Python，啟動服務器...
echo 📍 服務器地址: http://localhost:8000
echo 🛑 按 Ctrl+C 停止服務器
echo.

start http://localhost:8000
python -m http.server 8000
