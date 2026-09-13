# Generate PlantUML diagrams from markdown files
$DocsPath = $PSScriptRoot
$DiagramsPath = Join-Path $DocsPath "diagrams"
$PlantUMLJar = Join-Path $DocsPath "plantuml.jar"

if (-not (Test-Path $DiagramsPath)) {
    New-Item -ItemType Directory -Path $DiagramsPath | Out-Null
}

$MarkdownFiles = Get-ChildItem -Path $DocsPath -Filter "*.md"

Write-Host "Generating PlantUML diagrams..." -ForegroundColor Cyan
Write-Host ""

$DiagramCount = 0

foreach ($File in $MarkdownFiles) {
    Write-Host "Processing: $($File.Name)" -ForegroundColor Yellow
    
    $Content = Get-Content $File.FullName -Raw
    
    $Regex = '```plantuml\s*\n(@startuml\s+([^\s]+).*?@enduml)\s*\n```'
    $Matches = [regex]::Matches($Content, $Regex, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    
    foreach ($Match in $Matches) {
        $PlantUMLCode = $Match.Groups[1].Value
        $DiagramName = $Match.Groups[2].Value
        
        if ($DiagramName) {
            $DiagramCount++
            $PumlFile = Join-Path $DiagramsPath "$DiagramName.puml"
            
            $PlantUMLCode | Out-File -FilePath $PumlFile -Encoding UTF8
            
            java -jar $PlantUMLJar -tpng $PumlFile 2>&1 | Out-Null
            
            Write-Host "  Generated: $DiagramName.png" -ForegroundColor Green
            
            Remove-Item $PumlFile -ErrorAction SilentlyContinue
        }
    }
}

Write-Host ""
Write-Host "Completed! Generated $DiagramCount diagrams" -ForegroundColor Green
