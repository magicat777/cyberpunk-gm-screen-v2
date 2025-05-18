# PowerShell Script to Convert Divs to Buttons
Write-Host "Converting divs with onClick to proper buttons..." -ForegroundColor Green

# Files to fix
$filesToFix = @(
    @{Path="src\components\gm-tools\EncounterBuilder\EncounterBuilder.tsx"; Line=537},
    @{Path="src\components\interactive\NPCGenerator\NPCGenerator.tsx"; Line=426},
    @{Path="src\components\reference\EquipmentDatabase\EquipmentDatabase.tsx"; Line=261},
    @{Path="src\components\utility\SaveManager\SaveManager.tsx"; Line=146},
    @{Path="src\pages\Characters\Characters.tsx"; Line=0}
)

foreach ($fileInfo in $filesToFix) {
    $file = $fileInfo.Path
    if (Test-Path $file) {
        Write-Host "Fixing $file..." -ForegroundColor Cyan
        
        $content = Get-Content $file -Raw
        
        # Pattern 1: Convert div with onClick to button
        # Match: <div ... onClick={...} ... >
        $pattern1 = '<div([^>]*)(onClick=\{[^}]+\})([^>]*)>'
        $replacement1 = '<button$1$2$3 type="button" className="unstyled-button">'
        $content = $content -replace $pattern1, $replacement1
        
        # Pattern 2: Convert closing div tags that were changed to buttons
        # This is tricky - we need to match the correct closing tags
        # Simple approach: if we see role="button" we know it was converted
        $pattern2 = '<div([^>]*role="button"[^>]*)>'
        $replacement2 = '<button$1 type="button" className="unstyled-button">'
        $content = $content -replace $pattern2, $replacement2
        
        # Replace corresponding closing tags
        # This is a simplified approach - may need manual review
        $lines = $content -split "`n"
        $newLines = @()
        $buttonDepth = 0
        
        foreach ($line in $lines) {
            if ($line -match '<button[^>]*onClick') {
                $buttonDepth++
            }
            if ($line -match '</div>' -and $buttonDepth -gt 0) {
                $line = $line -replace '</div>', '</button>'
                $buttonDepth--
            }
            $newLines += $line
        }
        
        $content = $newLines -join "`n"
        $content | Set-Content $file -NoNewline
        
        Write-Host "  ✓ Converted clickable divs to buttons" -ForegroundColor Green
    }
}

# Add CSS for unstyled buttons
Write-Host "`nAdding CSS for unstyled buttons..." -ForegroundColor Cyan
$cssContent = @'

/* Unstyled button for div-like behavior */
.unstyled-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: left;
}

.unstyled-button:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
'@

Add-Content -Path "src\styles\index.css" -Value $cssContent

Write-Host "`n✓ All fixes applied!" -ForegroundColor Green
Write-Host "`nNote: You may need to manually review and adjust some conversions." -ForegroundColor Yellow
Write-Host "Some closing tags might need manual fixing if nested structures were complex." -ForegroundColor Yellow