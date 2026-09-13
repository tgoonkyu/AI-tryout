# Sound Files Download Helper Script
# Run this after downloading the 3 sound files to your Downloads folder

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Coin Flip App - Sound Files Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$downloadsPath = "$env:USERPROFILE\Downloads"
$targetPath = "d:\Projects\AI Training - 4-11-2025\trial\resources\sounds"

Write-Host "Looking for sound files in: $downloadsPath" -ForegroundColor Yellow
Write-Host ""

# Check for downloaded files
$files = @(
    @{ Name = "flip-start.mp3"; Pattern = "*technology*select*.mp3", "*select*click*.mp3", "flip-start.mp3" }
    @{ Name = "coin-rattle.mp3"; Pattern = "*coin*flip*.m4a", "*coin*flip*.mp3", "coin-rattle.mp3" }
    @{ Name = "flip-result.mp3"; Pattern = "*arcade*coin*.mp3", "*jump*coin*.mp3", "flip-result.mp3" }
)

$foundFiles = @{}

foreach ($file in $files) {
    Write-Host "Searching for: $($file.Name)..." -ForegroundColor Cyan
    
    foreach ($pattern in $file.Pattern) {
        $found = Get-ChildItem -Path $downloadsPath -Filter $pattern -ErrorAction SilentlyContinue | 
                 Sort-Object LastWriteTime -Descending | 
                 Select-Object -First 1
        
        if ($found) {
            $foundFiles[$file.Name] = $found.FullName
            Write-Host "  ✅ Found: $($found.Name)" -ForegroundColor Green
            break
        }
    }
    
    if (-not $foundFiles.ContainsKey($file.Name)) {
        Write-Host "  ❌ Not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan

if ($foundFiles.Count -eq 0) {
    Write-Host "❌ No sound files found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please download the files first:" -ForegroundColor Yellow
    Write-Host "  1. flip-start.mp3 from Mixkit" -ForegroundColor White
    Write-Host "  2. coin-rattle (m4a or mp3) from Freesound" -ForegroundColor White
    Write-Host "  3. flip-result.mp3 from Mixkit" -ForegroundColor White
    Write-Host ""
    Write-Host "See QUICK-REFERENCE.md for download links!" -ForegroundColor Cyan
    exit
}

Write-Host ""
Write-Host "Found $($foundFiles.Count) of 3 files" -ForegroundColor Yellow
Write-Host ""

# Ask for confirmation
Write-Host "Do you want to copy these files to the project? (Y/N): " -ForegroundColor Cyan -NoNewline
$response = Read-Host

if ($response -eq 'Y' -or $response -eq 'y') {
    Write-Host ""
    Write-Host "Copying files..." -ForegroundColor Yellow
    
    foreach ($file in $foundFiles.GetEnumerator()) {
        $sourcePath = $file.Value
        $destPath = Join-Path $targetPath $file.Key
        
        # Handle M4A to MP3 conversion notice
        if ($sourcePath -like "*.m4a" -and $file.Key -like "*.mp3") {
            Write-Host "⚠️  $($file.Key) is in M4A format" -ForegroundColor Yellow
            Write-Host "   Please convert to MP3 first using:" -ForegroundColor White
            Write-Host "   https://convertio.co/m4a-mp3/" -ForegroundColor Cyan
            continue
        }
        
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "✅ Copied: $($file.Key)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "✅ Files copied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Location: $targetPath" -ForegroundColor Cyan
    Write-Host ""
    
    # List final files
    Write-Host "Current sound files:" -ForegroundColor Yellow
    Get-ChildItem -Path $targetPath -Filter "*.mp3" | ForEach-Object {
        $size = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  ✓ $($_.Name) ($size KB)" -ForegroundColor Green
    }
    
    $mp3Count = (Get-ChildItem -Path $targetPath -Filter "*.mp3").Count
    if ($mp3Count -eq 3) {
        Write-Host ""
        Write-Host "🎉 All 3 sound files ready!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "⚠️  You have $mp3Count of 3 files. Download the missing ones." -ForegroundColor Yellow
    }
    
} else {
    Write-Host "Operation cancelled." -ForegroundColor Red
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
