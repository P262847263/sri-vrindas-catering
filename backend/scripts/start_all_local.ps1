<#
start_all_local.ps1

One-command local starter for development. What it does:
- Ensures Node bin is available for the session (adds C:\Program Files\nodejs temporarily)
- Installs backend and frontend npm dependencies (runs `npm install`)
- Attempts to start mongod using the DB path `D:\MongoData` (or a custom path passed via -DbPath)
- Starts backend and frontend in separate PowerShell windows and creates `backend-combined.log`

Usage:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\start_all_local.ps1

If you already use a different mongod path, pass `-DbPath 'C:\my\db'`.
This script does not require admin rights for the PATH modification (it is session-local).
If mongod is not installed, the script will print instructions.
#>

param(
  [string]$DbPath = 'D:\MongoData'
)

Write-Host "=== start_all_local: preparing environment ===" -ForegroundColor Cyan

# Temporarily ensure Node is available in this session
$nodeDefault = 'C:\Program Files\nodejs'
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  if (Test-Path $nodeDefault) {
    Write-Host "Temporarily adding $nodeDefault to PATH for this session" -ForegroundColor Yellow
    $env:Path = $env:Path + ";$nodeDefault"
  } else {
    Write-Host "Node not found at $nodeDefault and not on PATH. Install Node.js LTS from https://nodejs.org if needed." -ForegroundColor Red
  }
}

Write-Host "node: " -NoNewline; try { node -v } catch { Write-Host "(not available)" }
Write-Host "npm: " -NoNewline; try { npm -v } catch { Write-Host "(not available)" }

# Move to backend folder (this script expected under backend\scripts)
if (Test-Path '..\package.json') { Set-Location -LiteralPath '..' } else { Write-Host "Cannot find backend package.json relative to script. Run this script from backend\scripts." -ForegroundColor Red; exit 1 }

$backendPath = Get-Location
Write-Host "Backend folder: $backendPath" -ForegroundColor Cyan

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed in backend" -ForegroundColor Red; exit 1 }

# Install frontend deps (if frontend exists)
$frontendPath = Join-Path $backendPath '..\frontend'
if (Test-Path (Join-Path $frontendPath 'package.json')) {
  Write-Host "Installing frontend dependencies in: $frontendPath" -ForegroundColor Cyan
  Push-Location $frontendPath
  npm install
  if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed in frontend" -ForegroundColor Red; Pop-Location; exit 1 }
  Pop-Location
} else {
  Write-Host "Frontend folder not found at $frontendPath; skipping frontend install." -ForegroundColor Yellow
}

# Start mongod (best-effort)
Write-Host "\nChecking mongod..." -ForegroundColor Cyan
$mongodCmdEntry = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongodCmdEntry) { $mongodCmd = $mongodCmdEntry.Source } else { $mongodCmd = $null }
if (-not $mongodCmd) {
  # try common program files paths
  $possible = @(
    'C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe',
    'C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe',
    'C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe'
  )
  $mongodCmd = $possible | Where-Object { Test-Path $_ } | Select-Object -First 1
}

if ($mongodCmd) {
  Write-Host "Found mongod at: $mongodCmd" -ForegroundColor Green
  if (-not (Test-Path $DbPath)) {
    Write-Host "Creating DB folder: $DbPath" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $DbPath -Force | Out-Null
  }
  # Start mongod in its own window
  $mongodLog = Join-Path $backendPath 'mongod.log'
  $arg = "--dbpath","$DbPath","--bind_ip","127.0.0.1","2>&1","|","Tee-Object","-FilePath","$mongodLog"
  $command = "& `"$mongodCmd`" --dbpath `"$DbPath`" --bind_ip 127.0.0.1 2>&1 | Tee-Object -FilePath `"$mongodLog`""
  Start-Process -FilePath 'powershell' -ArgumentList '-NoExit','-Command',$command
  Write-Host "Started mongod in new window; log: $mongodLog" -ForegroundColor Green
  Start-Sleep -Seconds 3
} else {
  Write-Host "mongod executable not found. Please install MongoDB or start a mongod instance manually. Skipping automatic mongod start." -ForegroundColor Yellow
}

# Start backend+frontend in a new window and capture combined logs
$logFile = Join-Path $backendPath 'backend-combined.log'
$startCmd = "Set-Location -LiteralPath '$($backendPath.Path)'; npm run start:dev 2>&1 | Tee-Object -FilePath '$logFile'"
Start-Process -FilePath 'powershell' -ArgumentList '-NoExit','-Command',$startCmd
Write-Host "Started backend+frontend in new PowerShell window. Combined log: $logFile" -ForegroundColor Green

Write-Host "Done. Tail logs with:" -ForegroundColor Cyan
Write-Host "  Get-Content -Path '$logFile' -Wait -Tail 200" -ForegroundColor Cyan
Write-Host "and check mongod with:" -ForegroundColor Cyan
Write-Host "  Get-Content -Path '$($backendPath)\mongod.log' -Wait -Tail 200" -ForegroundColor Cyan
