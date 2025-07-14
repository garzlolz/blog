#!/bin/bash

echo "🚀 啟動本地開發服務器..."
echo

# 檢查 Node.js 是否安裝
if command -v node &> /dev/null; then
    echo "✅ 發現 Node.js，使用 npx serve..."
    echo "📍 服務器地址: http://localhost:8000"
    echo "🛑 按 Ctrl+C 停止服務器"
    echo

    # 在背景打開瀏覽器
    if command -v open &> /dev/null; then
        open http://localhost:8000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000
    fi

    npx serve . -p 8000
    exit 0
fi

# 如果沒有 Node.js，嘗試 Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ 未找到 Node.js 或 Python，請安裝其中之一"
    echo
    echo "💡 推薦安裝 Node.js: https://nodejs.org"
    exit 1
fi

echo "✅ 發現 Python，啟動服務器..."
echo "📍 服務器地址: http://localhost:8000"
echo "🛑 按 Ctrl+C 停止服務器"
echo

# 在背景打開瀏覽器
if command -v open &> /dev/null; then
    open http://localhost:8000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:8000
fi

$PYTHON_CMD -m http.server 8000
