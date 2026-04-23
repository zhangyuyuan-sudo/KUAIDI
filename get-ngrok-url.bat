@echo off
chcp 65001 >nul
echo.
echo 正在获取 ngrok 公网 URL...
echo.

REM 使用 curl 获取 ngrok API 信息
curl -s http://127.0.0.1:4040/api/tunnels > ngrok-temp.json 2>nul

if errorlevel 1 (
    echo [错误] 无法连接到 ngrok 服务
    echo.
    echo 请确保 ngrok 已启动：
    echo   .\ngrok\ngrok.exe http 3000
    echo.
    pause
    exit /b 1
)

REM 查找 public_url
for /f "tokens=*" %%a in ('type ngrok-temp.json ^| findstr "public_url"') do (
    set "line=%%a"
    goto :found
)

:found
del ngrok-temp.json >nul 2>&1

REM 提取 URL
set "url=!line:*"https://=""
set "url=https://!url:"=!"
set "url=!url:public_url:=!"
set "url=!url: =!"
set "url=!url:"=!"
set "url=!url:,,=!"

REM 清理 URL
for /f "delims=" %%i in ("!url!") do set "url=%%i"

echo ==========================================
echo   ngrok 启动成功！
echo ==========================================
echo.
echo 公网 URL: !url!
echo 本地转发: http://localhost:3000
echo.
echo 请将此 URL 配置到 backend\.env 文件中：
echo NGROK_URL=!url!
echo.

REM 更新 .env 文件
set "envFile=.\backend\.env"
if exist "%envFile%" (
    powershell -Command "(Get-Content '%envFile%') -replace 'NGROK_URL=.*', 'NGROK_URL=!url!' | Set-Content '%envFile%'"
    if errorlevel 1 (
        powershell -Command "Add-Content '%envFile%' 'NGROK_URL=!url!'"
    )
    echo [OK] 已更新 backend\.env 文件
) else (
    echo [警告] 未找到 backend\.env 文件
)

echo.
pause
