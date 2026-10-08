<#
start_mongod.ps1
Start mongod using a specified DB path (defaults to D:\MongoData).
Run in a separate PowerShell window so the process keeps running:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\start_mongod.ps1 -DbPath 'D:\MongoData'

If mongod executable isn't on PATH, the script will try common install locations.
#>

param(
  [string]$DbPath = 'D:\MongoData'
)

# Find mongod executable
$mongodCmdEntry = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongodCmdEntry) {
  $mongodCmd = $mongodCmdEntry.Source
} else {
  $mongodCmd = $null
}

if (-not $mongodCmd) {
  $possible = @(
    'C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe',
    'C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe',
    'C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe'
  )
  $mongodCmd = $possible | Where-Object { Test-Path $_ } | Select-Object -First 1
}

if (-not $mongodCmd) {
  Write-Error "mongod executable not found on PATH or common locations. Install MongoDB or provide the full path to mongod.exe."
  exit 1
}

# Ensure db folder exists
if (-not (Test-Path $DbPath)) {
  try {
    New-Item -ItemType Directory -Path $DbPath -Force | Out-Null
    Write-Host "Created DB folder: $DbPath" -ForegroundColor Green
  } catch {
    Write-Error "Failed to create DB folder: $DbPath -> $($_.Exception.Message)"
    exit 1
  }
}

Write-Host "Starting mongod using: $mongodCmd" -ForegroundColor Cyan
Write-Host "DB path: $DbPath" -ForegroundColor Cyan
Write-Host "This window will run mongod and display logs. Keep it open to keep MongoDB running." -ForegroundColor Yellow

# Run mongod (blocking) so logs are visible in this window
& "$mongodCmd" "--dbpath" "$DbPath" "--bind_ip" "127.0.0.1"
