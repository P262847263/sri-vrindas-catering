<#
add_node_to_path.ps1
Adds `C:\Program Files\nodejs` (and Roaming npm bin if present) to the User PATH persistently.
Run once in PowerShell as your user (no admin required):
PowerShell> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\add_node_to_path.ps1
#>

$nodePath = 'C:\Program Files\nodejs'
$npmBin = "$env:USERPROFILE\AppData\Roaming\npm"

$userPath = [Environment]::GetEnvironmentVariable('Path','User')
$updated = $false

if ($userPath -notlike "*$nodePath*") {
    if ([string]::IsNullOrEmpty($userPath)) { $newPath = $nodePath } else { $newPath = "$userPath;$nodePath" }
    [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    Write-Host "Added $nodePath to User PATH (persistent)." -ForegroundColor Green
    $updated = $true
} else {
    Write-Host "$nodePath already present in User PATH." -ForegroundColor Yellow
}

if (Test-Path $npmBin) {
    $userPath = [Environment]::GetEnvironmentVariable('Path','User')
    if ($userPath -notlike "*$npmBin*") {
        $newPath = "$userPath;$npmBin"
        [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
        Write-Host "Added $npmBin to User PATH (persistent)." -ForegroundColor Green
        $updated = $true
    } else {
        Write-Host "$npmBin already present in User PATH." -ForegroundColor Yellow
    }
} else {
    Write-Host "$npmBin not found; skipping adding Roaming npm bin." -ForegroundColor Yellow
}

if ($updated) {
    Write-Host "Close and re-open PowerShell windows to pick up the new PATH." -ForegroundColor Cyan
} else {
    Write-Host "No changes made to User PATH." -ForegroundColor Cyan
}
