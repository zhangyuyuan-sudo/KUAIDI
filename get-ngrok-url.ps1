# 获取 ngrok 公网 URL
$ngrokApi = "http://127.0.0.1:4040/api/tunnels"

try {
    $response = Invoke-WebRequest -Uri $ngrokApi -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.tunnels.Count -gt 0) {
        $publicUrl = $data.tunnels[0].public_url
        Write-Host ""
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host "  ngrok 启动成功！" -ForegroundColor Green
        Write-Host "==========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "公网 URL: $publicUrl" -ForegroundColor Cyan
        Write-Host "本地转发: http://localhost:3000" -ForegroundColor Gray
        Write-Host ""
        Write-Host "请将此 URL 配置到 backend\.env 文件中：" -ForegroundColor Yellow
        Write-Host "NGROK_URL=$publicUrl" -ForegroundColor Magenta
        Write-Host ""
        
        # 自动更新 .env 文件
        $envPath = ".\backend\.env"
        if (Test-Path $envPath) {
            $envContent = Get-Content $envPath -Raw
            if ($envContent -match "NGROK_URL=") {
                $envContent = $envContent -replace "NGROK_URL=.*", "NGROK_URL=$publicUrl"
            } else {
                $envContent += "`nNGROK_URL=$publicUrl"
            }
            Set-Content $envPath $envContent -NoNewline
            Write-Host "已自动更新 backend\.env 文件" -ForegroundColor Green
        }
        Write-Host ""
    } else {
        Write-Host "ngrok 正在启动中，请稍后再试..." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "无法连接到 ngrok 服务，请确保 ngrok 已启动" -ForegroundColor Red
    Write-Host "启动命令: .\ngrok\ngrok.exe http 3000" -ForegroundColor Gray
}
