# Sync resources from central location to frontend/public
# Run this script before starting the frontend dev server or building

$projectRoot = Split-Path -Parent $PSScriptRoot
$resourcesDir = Join-Path $projectRoot "resources"
$publicDir = Join-Path $projectRoot "frontend\public"

Write-Host "🔄 Syncing resources from resources/ to frontend/public..." -ForegroundColor Cyan

# Create public directory if it doesn't exist
if (-not (Test-Path $publicDir)) {
    New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
}

# Copy coin images
Write-Host "  📁 Copying coin images..." -ForegroundColor Yellow
$imagesSource = Join-Path $resourcesDir "images"
$coinHeads = Join-Path $imagesSource "coin-heads.svg"
$coinTails = Join-Path $imagesSource "coin-tails.svg"

if (Test-Path $coinHeads) {
    Copy-Item $coinHeads -Destination $publicDir -Force
    Write-Host "    ✅ coin-heads.svg" -ForegroundColor Green
}

if (Test-Path $coinTails) {
    Copy-Item $coinTails -Destination $publicDir -Force
    Write-Host "    ✅ coin-tails.svg" -ForegroundColor Green
}

# Create sounds directory in public if needed (for future sound integration)
$publicSoundsDir = Join-Path $publicDir "sounds"
if (-not (Test-Path $publicSoundsDir)) {
    New-Item -ItemType Directory -Path $publicSoundsDir -Force | Out-Null
}

# Copy sound files if they exist
Write-Host "  🔊 Checking for sound files..." -ForegroundColor Yellow
$soundsSource = Join-Path $resourcesDir "sounds"
$soundFiles = @("flip-start.mp3", "coin-rattle.mp3", "flip-result.mp3")

foreach ($soundFile in $soundFiles) {
    $sourcePath = Join-Path $soundsSource $soundFile
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $publicSoundsDir -Force
        Write-Host "    ✅ $soundFile" -ForegroundColor Green
    } else {
        Write-Host "    ⚠️  $soundFile not found (will be needed for sound effects)" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "✨ Resource sync complete!" -ForegroundColor Green
Write-Host "   Frontend can now access resources from /public" -ForegroundColor Gray
