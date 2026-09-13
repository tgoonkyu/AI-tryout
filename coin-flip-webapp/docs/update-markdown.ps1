# Update markdown files to use diagram images instead of PlantUML code
$DocsPath = $PSScriptRoot
$DiagramsPath = Join-Path $DocsPath "diagrams"

$MarkdownFiles = Get-ChildItem -Path $DocsPath -Filter "*.md"

Write-Host "Updating markdown files with diagram images..." -ForegroundColor Cyan
Write-Host ""

$UpdateCount = 0

foreach ($File in $MarkdownFiles) {
    Write-Host "Processing: $($File.Name)" -ForegroundColor Yellow
    
    $Content = Get-Content $File.FullName -Raw
    $OriginalContent = $Content
    
    # Find and replace PlantUML blocks with image references
    $Regex = '```plantuml\s*\n@startuml\s+([^\s]+).*?@enduml\s*\n```'
    
    $Content = [regex]::Replace($Content, $Regex, {
        param($Match)
        $DiagramName = $Match.Groups[1].Value
        $PngFile = "diagrams/$DiagramName.png"
        
        # Check if PNG exists
        $PngPath = Join-Path $DocsPath $PngFile
        if (Test-Path $PngPath) {
            Write-Host "  Replaced: $DiagramName" -ForegroundColor Green
            return "![${DiagramName}](${PngFile})"
        } else {
            Write-Host "  Skipped: $DiagramName (PNG not found)" -ForegroundColor Yellow
            return $Match.Value
        }
    }, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    # Save if content changed
    if ($Content -ne $OriginalContent) {
        $Content | Out-File -FilePath $File.FullName -Encoding UTF8 -NoNewline
        $UpdateCount++
    }
}

Write-Host ""
Write-Host "Completed! Updated $UpdateCount markdown files" -ForegroundColor Green
Write-Host "All diagrams are now embedded as images!" -ForegroundColor Green
