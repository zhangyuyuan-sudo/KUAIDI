@echo off
chcp 65001 >nul
echo ==========================================
echo       启动 ngrok 转发到本地 3000 端口
echo ==========================================
echo.

REM 检查 ngrok 是否存在
if exist "%~dp0tools\ngrok.exe" (
    echo 使用项目目录下的 ngrok...
    "%~dp0tools\ngrok.exe" http 3000
) else if exist "C:\Program Files\ngrok\ngrok.exe" (
    echo 使用系统安装的 ngrok...
    "C:\Program Files\ngrok\ngrok.exe" http 3000
) else (
    echo [错误] 未找到 ngrok.exe
    echo.
    echo 请按以下步骤操作：
    echo 1. 访问 https://dashboard.ngrok.com/get-started/setup/windows
    echo 2. 下载 ngrok Windows 版本
    echo 3. 解压 ngrok.exe 到以下任一位置：
    echo    - 本项目 tools 文件夹: %~dp0tools\
    echo    - 或系统目录: C:\Program Files\ngrok\
    echo 4. 运行 ngrok config add-authtoken YOUR_TOKEN
    echo.
    pause
)
