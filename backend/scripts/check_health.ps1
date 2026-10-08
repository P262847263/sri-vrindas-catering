<#
check_health.ps1
Run simple health checks against backend and frontend endpoints.
#>

param(
  [string]$BackendBase = 'http://localhost:3000',
  [string]$FrontendBase = 'http://localhost:5173'
)

Write-Host "=== Health check ===`n" -ForegroundColor Cyan

function TryGet($url) {
  try {
    $r = Invoke-RestMethod -Uri $url -Method GET -ErrorAction Stop
    Write-Host "[OK] $url" -ForegroundColor Green
    return $r
  } catch {
    Write-Host "[ERR] $url -> $($_.Exception.Message)" -ForegroundColor Red
    return $null
  }
}

Write-Host "Checking backend root..."
TryGet "$BackendBase/"

Write-Host "Checking backend /api/menu..."
TryGet "$BackendBase/api/menu"

Write-Host "Checking frontend root..."
TryGet "$FrontendBase/"

Write-Host "Health check complete." -ForegroundColor Cyan
