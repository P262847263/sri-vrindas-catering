Write-Host "=== Node/NPM Environment Diagnostic ===`n"

# Check node and npm versions
Write-Host "Checking 'node' and 'npm' on PATH..." -ForegroundColor Cyan
Write-Host "node -v:" -NoNewline
try { node -v 2>$null } catch { Write-Host " (not found)"; }

Write-Host "npm -v:" -NoNewline
try { npm -v 2>$null } catch { Write-Host " (not found)"; }

# Use Get-Command to see where PowerShell finds them
Write-Host "`nGet-Command output:" -ForegroundColor Cyan
Get-Command node -ErrorAction SilentlyContinue | Format-List -Force
Get-Command npm -ErrorAction SilentlyContinue | Format-List -Force

# Use where.exe to search PATH
Write-Host "`nwhere.exe results (searches PATH):" -ForegroundColor Cyan
try { & where.exe node } catch { Write-Host "node: not found on PATH" }
try { & where.exe npm } catch { Write-Host "npm: not found on PATH" }

# Show PATH entries that might contain node/npm
Write-Host "`nPATH entries containing 'node' or 'npm':" -ForegroundColor Cyan
$env:Path -split ';' | Where-Object { $_ -match 'node|npm' } | ForEach-Object { Write-Host $_ }

# Check common installation locations
Write-Host "`nCommon locations check:" -ForegroundColor Cyan
$checks = @(
  'C:\Program Files\nodejs\node.exe',
  'C:\Program Files (x86)\nodejs\node.exe',
  "$env:USERPROFILE\AppData\Roaming\npm\npm.cmd",
  "$env:USERPROFILE\AppData\Roaming\npm\npm",
  'C:\Program Files\nodejs\npm.cmd'
)
foreach ($p in $checks) {
  if (Test-Path $p) { Write-Host "Found: $p" } else { Write-Host "Not found: $p" }
}

# Try searching for node.exe (may take a while)
Write-Host "`nSearching for node.exe under C:\Program Files (quick)" -ForegroundColor Cyan
Get-ChildItem -Path 'C:\Program Files','C:\Program Files (x86)' -Filter 'node.exe' -Recurse -ErrorAction SilentlyContinue | Select-Object FullName -First 10 | ForEach-Object { Write-Host $_.FullName }

# Check registry for Node install path (common keys)
Write-Host "`nRegistry checks for Node.js (HKLM)" -ForegroundColor Cyan
try {
  Get-ItemProperty 'HKLM:\SOFTWARE\Node.js' -ErrorAction SilentlyContinue | Format-List -Force
} catch {}
try {
  Get-ItemProperty 'HKLM:\SOFTWARE\Wow6432Node\Node.js' -ErrorAction SilentlyContinue | Format-List -Force
} catch {}

Write-Host "`nDiagnostic complete. If 'npm' was not found, install Node.js LTS from https://nodejs.org and then re-open PowerShell." -ForegroundColor Green
