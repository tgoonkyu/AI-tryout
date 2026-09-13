# Project Status JSON Extractor
# Extracts the JSON status from STATE.md for automated monitoring

param(
    [switch]$Export,
    [string]$OutputPath = "project-status.json"
)

$stateFile = Join-Path $PSScriptRoot "..\docs\STATE.md"

Write-Host "📊 Project Status Extractor" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

if (-not (Test-Path $stateFile)) {
    Write-Host "❌ STATE.md not found!" -ForegroundColor Red
    exit 1
}

# Read the STATE.md file
$content = Get-Content $stateFile -Raw

# Extract JSON between ```json and ```
$jsonPattern = '(?s)```json\s*(.*?)\s*```'
if ($content -match $jsonPattern) {
    $jsonString = $matches[1]
    
    try {
        # Parse JSON to validate
        $status = $jsonString | ConvertFrom-Json
        
        Write-Host "✅ JSON Status Extracted Successfully" -ForegroundColor Green
        Write-Host ""
        
        # Display key information
        Write-Host "Project: $($status.project.name)" -ForegroundColor Cyan
        Write-Host "Version: $($status.project.version)" -ForegroundColor White
        Write-Host "Last Updated: $($status.project.lastUpdated)" -ForegroundColor White
        Write-Host ""
        Write-Host "Current Phase: $($status.status.currentPhase)" -ForegroundColor Yellow
        Write-Host "Overall Progress: $($status.status.overallProgress)%" -ForegroundColor Green
        Write-Host ""
        
        # Display phase progress
        Write-Host "Phase Progress:" -ForegroundColor Cyan
        Write-Host "  Phase 0 (Planning): $($status.status.phase0Progress)%" -ForegroundColor $(if ($status.status.phase0Progress -eq 100) { "Green" } elseif ($status.status.phase0Progress -gt 0) { "Yellow" } else { "White" })
        Write-Host "  Phase 1 (Infrastructure): $($status.status.phase1Progress)%" -ForegroundColor $(if ($status.status.phase1Progress -eq 100) { "Green" } elseif ($status.status.phase1Progress -gt 0) { "Yellow" } else { "White" })
        Write-Host "  Phase 2 (Backend): $($status.status.phase2Progress)%" -ForegroundColor $(if ($status.status.phase2Progress -eq 100) { "Green" } elseif ($status.status.phase2Progress -gt 0) { "Yellow" } else { "White" })
        Write-Host "  Phase 3 (Frontend): $($status.status.phase3Progress)%" -ForegroundColor $(if ($status.status.phase3Progress -eq 100) { "Green" } elseif ($status.status.phase3Progress -gt 0) { "Yellow" } else { "White" })
        Write-Host "  Phase 4 (Integration): $($status.status.phase4Progress)%" -ForegroundColor $(if ($status.status.phase4Progress -eq 100) { "Green" } elseif ($status.status.phase4Progress -gt 0) { "Yellow" } else { "White" })
        Write-Host "  Phase 5 (Docker): $($status.status.phase5Progress)%" -ForegroundColor $(if ($status.status.phase5Progress -eq 100) { "Green" } elseif ($status.status.phase5Progress -gt 0) { "Yellow" } else { "White" })
        Write-Host ""
        
        # Display metrics
        Write-Host "Metrics:" -ForegroundColor Cyan
        Write-Host "  Total Commits: $($status.metrics.totalCommits)" -ForegroundColor White
        Write-Host "  Features: $($status.metrics.completedFeatures)/$($status.metrics.totalFeatures)" -ForegroundColor White
        Write-Host "  Backend Coverage: $($status.metrics.backendTestCoverage)%" -ForegroundColor White
        Write-Host "  Frontend Coverage: $($status.metrics.frontendTestCoverage)%" -ForegroundColor White
        Write-Host ""
        
        # Display next milestone
        Write-Host "Next Milestone: $($status.milestones.nextMilestone)" -ForegroundColor Yellow
        Write-Host "Target Date: $($status.milestones.nextMilestoneDate)" -ForegroundColor White
        Write-Host ""
        
        if ($Export) {
            $jsonString | Set-Content -Path $OutputPath -Encoding UTF8
            Write-Host "✅ JSON exported to: $OutputPath" -ForegroundColor Green
        }
        
        # Return the parsed object for programmatic use
        return $status
        
    } catch {
        Write-Host "❌ Invalid JSON format!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ JSON block not found in STATE.md!" -ForegroundColor Red
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
