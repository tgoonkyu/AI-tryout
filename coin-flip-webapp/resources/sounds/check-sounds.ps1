# Quick Check - Do you have the sound files?
# Run this anytime to check the status

$targetPath = "d:\Projects\AI Training - 4-11-2025\trial\resources\sounds"

Write-Host "`n🔊 Sound Files Status Check" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$requiredFiles = @("flip-start.mp3", "coin-rattle.mp3", "flip-result.mp3")
$foundCount = 0

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $targetPath $file
    if (Test-Path $filePath) {
        $size = [math]::Round((Get-Item $filePath).Length / 1KB, 2)
        Write-Host "✅ $file ($size KB)" -ForegroundColor Green
        $foundCount++
    } else {
        Write-Host "❌ $file (missing)" -ForegroundColor Red
    }
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Status: $foundCount of 3 files ready" -ForegroundColor $(if ($foundCount -eq 3) { "Green" } else { "Yellow" })

if ($foundCount -eq 3) {
    Write-Host "🎉 All sound files are ready!" -ForegroundColor Green
    Write-Host "You can now proceed with frontend development!" -ForegroundColor Cyan
} else {
    Write-Host "`n📥 To download missing files:" -ForegroundColor Yellow
    Write-Host "   See: QUICK-REFERENCE.md" -ForegroundColor White
    Write-Host "`n🌐 Browser tabs opened with download links!" -ForegroundColor Cyan
}

Write-Host ""
