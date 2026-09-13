# Sound Files Download Helper Script
# This script helps you download and set up the sound files

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Coin Flip App - Sound Files Setup" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$targetPath = "d:\Projects\AI Training - 4-11-2025\coin-flip-webapp\resources\sounds"

Write-Host "Sound files should be placed in: $targetPath" -ForegroundColor Yellow
Write-Host ""

Write-Host "📥 DOWNLOAD INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. flip-start.mp3" -ForegroundColor Green
Write-Host "   🌐 https://mixkit.co/free-sound-effects/click/" -ForegroundColor White
Write-Host "   🔍 Search for: 'Modern technology select'" -ForegroundColor White
Write-Host "   💾 Save as: flip-start.mp3" -ForegroundColor White
Write-Host ""

Write-Host "2. coin-rattle.mp3" -ForegroundColor Green
Write-Host "   🌐 https://freesound.org/people/eZZin/sounds/545857/" -ForegroundColor White
Write-Host "   📥 Download: 'Coin flip.m4a'" -ForegroundColor White
Write-Host "   🔄 Convert to MP3 (use https://convertio.co/m4a-mp3/)" -ForegroundColor White
Write-Host "   💾 Save as: coin-rattle.mp3" -ForegroundColor White
Write-Host ""

Write-Host "3. flip-result.mp3" -ForegroundColor Green
Write-Host "   🌐 https://mixkit.co/free-sound-effects/click/" -ForegroundColor White
Write-Host "   🔍 Search for: 'Arcade game jump coin'" -ForegroundColor White
Write-Host "   💾 Save as: flip-result.mp3" -ForegroundColor White
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "After downloading all files, run:" -ForegroundColor Yellow
Write-Host "cd frontend; npm run sync-resources" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check current status
Write-Host "Current sound files status:" -ForegroundColor Yellow
$soundFiles = @("flip-start.mp3", "coin-rattle.mp3", "flip-result.mp3")
$allPresent = $true

foreach ($file in $soundFiles) {
    $filePath = Join-Path $targetPath $file
    if (Test-Path $filePath) {
        $size = (Get-Item $filePath).Length
        if ($size -gt 0) {
            Write-Host "  ✅ $file ($size bytes)" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file (empty file)" -ForegroundColor Red
            $allPresent = $false
        }
    } else {
        Write-Host "  ❌ $file (missing)" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""
if ($allPresent) {
    Write-Host "🎉 All sound files are ready!" -ForegroundColor Green
    Write-Host "Run 'npm run sync-resources' to copy to frontend." -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Some sound files are missing or empty." -ForegroundColor Yellow
    Write-Host "Please download the missing files using the links above." -ForegroundColor White
}