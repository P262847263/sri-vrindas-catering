<#
run_all.ps1
Helper to prepare environment, install dependencies and start backend+frontend.
Run from any PowerShell: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\run_all.ps1
#>

Write-Host "=== Run All: setup, install, and start backend+frontend ===`n" -ForegroundColor Cyan

# Ensure Node is available or add common install path
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  $nodeDefault = 'C:\Program Files\nodejs'
  if (Test-Path $nodeDefault) {
    Write-Host "Node not found on PATH. Temporarily adding $nodeDefault for this session..." -ForegroundColor Yellow
    $env:Path = $env:Path + ";$nodeDefault"
  } else {
    Write-Host "Node not found on PATH and '$nodeDefault' does not exist. Please install Node.js LTS from https://nodejs.org" -ForegroundColor Red
    return
  }
}

# show versions
Write-Host "node:" -NoNewline; node -v
Write-Host "npm:" -NoNewline; npm -v

# Install backend deps
$backendDir = (Resolve-Path "..\")
# if this script is under backend\scripts, set proper folder
if (Test-Path '..\package.json') { Set-Location -LiteralPath '..' } elseif (Test-Path '.\..\..\backend\package.json') { Set-Location -LiteralPath '..\..\backend' }
$backendPath = Get-Location
Write-Host "\nInstalling backend dependencies in: $backendPath" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed in backend" -ForegroundColor Red; exit 1 }

# Install frontend deps
$frontendPath = Join-Path $backendPath '..\frontend' -Resolve
if (-not (Test-Path (Join-Path $frontendPath 'package.json'))) {
  # try sibling folder name 'frontend' from repo root
  $frontendPath = (Resolve-Path '..\frontend' -ErrorAction SilentlyContinue)
}
if ($frontendPath) {
  Write-Host "\nInstalling frontend dependencies in: $frontendPath" -ForegroundColor Cyan
  Push-Location $frontendPath
  npm install
  if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed in frontend" -ForegroundColor Red; Pop-Location; exit 1 }
  Pop-Location
} else {
  Write-Host "Frontend package.json not found; skipping frontend install." -ForegroundColor Yellow
}

# Ensure MongoDB running (best-effort)
Write-Host "\nChecking MongoDB service (best effort)" -ForegroundColor Cyan
$mongoRunning = Get-Process -Name mongod -ErrorAction SilentlyContinue
if (-not $mongoRunning) {
  Write-Host "mongod not running. Trying to start MongoDB service (may require admin)..." -ForegroundColor Yellow
  try {
    Start-Process -FilePath 'net' -ArgumentList 'start','MongoDB' -NoNewWindow -Wait -ErrorAction Stop
    Write-Host "Tried to start MongoDB service. Check logs above for success." -ForegroundColor Green
  } catch {
    Write-Host "Could not start MongoDB service (permission or not installed). Attempting to start 'mongod' directly if found on PATH or using common DB paths..." -ForegroundColor Yellow

    # If user provided a DB path like D:\MongoData, try to start mongod with that dbpath.
    $candidateDbPaths = @(
      "$env:USERPROFILE\data\db",
      'C:\data\db',
      'D:\MongoData'
    )

    $mongodCmd = (Get-Command mongod -ErrorAction SilentlyContinue)?.Source
    if (-not $mongodCmd) {
      # Try common program files locations for mongod
      $possible = @(
        'C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe',
        'C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe',
        'C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe'
      )
      $mongodCmd = $possible | Where-Object { Test-Path $_ } | Select-Object -First 1
    }

    if ($mongodCmd) {
      # Find the first existing dbpath candidate
      $dbpath = $candidateDbPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
      if ($dbpath) {
        Write-Host "Starting mongod with dbpath: $dbpath" -ForegroundColor Cyan
        Start-Process -FilePath $mongodCmd -ArgumentList "--dbpath","$dbpath" -NoNewWindow -PassThru | Out-Null
        Start-Sleep -Seconds 2
        $mongoRunning = Get-Process -Name mongod -ErrorAction SilentlyContinue
        if ($mongoRunning) { Write-Host "Started mongod process using dbpath $dbpath" -ForegroundColor Green }
        else { Write-Host "Failed to start mongod process. Please start MongoDB manually or set MONGO_URI to an Atlas connection string." -ForegroundColor Red }
      } else {
        Write-Host "No local dbpath candidates found (checked: $($candidateDbPaths -join ', ')). Please create the folder or set MONGO_URI." -ForegroundColor Yellow
      }
    } else {
      Write-Host "mongod executable not found on PATH or common locations. Please install MongoDB or provide a MONGO_URI to use Atlas." -ForegroundColor Red
    }
  }
} else {
  Write-Host "mongod process is already running." -ForegroundColor Green
}

# Start backend+frontend using start:dev (concurrently)
Write-Host "\nStarting backend+frontend (npm run start:dev). Output will be logged to 'backend-combined.log' in backend folder." -ForegroundColor Cyan
# Ensure we're in backend folder
if (-not (Test-Path 'package.json')) { Write-Host "Not in backend folder. Aborting." -ForegroundColor Red; exit 1 }

$logFile = Join-Path (Get-Location) 'backend-combined.log'
# Use Start-Process to open in new window so this script can exit or keep running
# We'll start in the background with a new PowerShell process so user can close this one
$command = "Set-Location -LiteralPath '$((Get-Location).Path)'; npm run start:dev 2>&1 | Tee-Object -FilePath '$logFile'"
Start-Process -FilePath 'powershell' -ArgumentList '-NoExit','-Command',$command
Write-Host "Started backend+frontend in a new PowerShell window. Tail the log with:`nGet-Content -Path '$logFile' -Wait -Tail 200" -ForegroundColor Green

Write-Host "Run 'Get-Content -Path '$logFile' -Wait -Tail 200' to watch logs." -ForegroundColor Cyan

# End
Write-Host "Done. If anything failed earlier, read the output above or the created log file." -ForegroundColor Green
