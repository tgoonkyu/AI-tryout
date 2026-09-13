# Project Status Updater
# Updates specific fields in the JSON status within STATE.md

param(
    [string]$Phase,
    [int]$Progress,
    [string]$Status,
    [int]$OverallProgress,
    [switch]$ShowHelp
)

if ($ShowHelp) {
    Write-Host @"
📊 Project Status Updater

Usage: .\update-status.ps1 [parameters]

Parameters:
  -Phase <string>          Phase number (0-5) or name
  -Progress <int>          Progress percentage (0-100)
  -Status <string>         Status: not_started, in_progress, completed
  -OverallProgress <int>   Overall project progress (0-100)
  -ShowHelp               Show this help message

Examples:
  # Update Phase 1 progress to 50%
  .\update-status.ps1 -Phase 1 -Progress 50

  # Mark Phase 0 as completed
  .\update-status.ps1 -Phase 0 -Status completed -Progress 100

  # Update overall progress
  .\update-status.ps1 -OverallProgress 25

  # Update multiple values
  .\update-status.ps1 -Phase 1 -Progress 75 -Status in_progress -OverallProgress 20

"@ -ForegroundColor Cyan
    exit 0
}

$stateFile = Join-Path $PSScriptRoot "..\docs\STATE.md"

Write-Host "📊 Updating Project Status" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

if (-not (Test-Path $stateFile)) {
    Write-Host "❌ STATE.md not found!" -ForegroundColor Red
    exit 1
}

# Read the STATE.md file
$content = Get-Content $stateFile -Raw

# Extract JSON
$jsonPattern = '(?s)```json\s*(.*?)\s*```'
if ($content -match $jsonPattern) {
    $jsonString = $matches[1]
    $status = $jsonString | ConvertFrom-Json
    
    $updated = $false
    
    # Update Phase Progress
    if ($Phase -and $Progress -ge 0) {
        $phaseKey = "phase$Phase"
        if ($status.status.PSObject.Properties.Name -contains "${phaseKey}Progress") {
            $oldValue = $status.status."${phaseKey}Progress"
            $status.status."${phaseKey}Progress" = $Progress
            Write-Host "✅ Updated Phase $Phase progress: $oldValue% → $Progress%" -ForegroundColor Green
            
            # Update phase status if provided
            if ($Status) {
                $status.phases."$phaseKey".status = $Status
                $status.phases."$phaseKey".progress = $Progress
                Write-Host "✅ Updated Phase $Phase status: $Status" -ForegroundColor Green
            }
            $updated = $true
        } else {
            Write-Host "❌ Invalid phase number: $Phase" -ForegroundColor Red
        }
    }
    
    # Update Overall Progress
    if ($OverallProgress -ge 0) {
        $oldValue = $status.status.overallProgress
        $status.status.overallProgress = $OverallProgress
        Write-Host "✅ Updated overall progress: $oldValue% → $OverallProgress%" -ForegroundColor Green
        $updated = $true
    }
    
    # Update timestamp
    if ($updated) {
        $status.project.lastUpdated = Get-Date -Format "yyyy-MM-dd"
        
        # Convert back to JSON
        $newJsonString = $status | ConvertTo-Json -Depth 10
        
        # Replace in content
        $newContent = $content -replace $jsonPattern, "``````json`n$newJsonString`n``````"
        
        # Write back to file
        $newContent | Set-Content -Path $stateFile -Encoding UTF8 -NoNewline
        
        Write-Host ""
        Write-Host "✅ STATE.md updated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Current Status:" -ForegroundColor Cyan
        Write-Host "  Overall Progress: $($status.status.overallProgress)%" -ForegroundColor Yellow
        Write-Host "  Phase 0: $($status.status.phase0Progress)%" -ForegroundColor White
        Write-Host "  Phase 1: $($status.status.phase1Progress)%" -ForegroundColor White
        Write-Host "  Phase 2: $($status.status.phase2Progress)%" -ForegroundColor White
        Write-Host "  Phase 3: $($status.status.phase3Progress)%" -ForegroundColor White
        Write-Host "  Phase 4: $($status.status.phase4Progress)%" -ForegroundColor White
        Write-Host "  Phase 5: $($status.status.phase5Progress)%" -ForegroundColor White
    } else {
        Write-Host "⚠️  No updates made. Use -ShowHelp for usage." -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ JSON block not found in STATE.md!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
