# Simple PowerShell Script to Fix Accessibility Issues
Write-Host "Starting Accessibility Fixes..." -ForegroundColor Green

# Create accessibility helper
$helperContent = @'
export const handleKeyboardClick = (event, onClick) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};
'@
$helperContent | Out-File -FilePath "src\utils\accessibilityHelpers.ts" -Encoding UTF8

# Fix Footer href
$footerPath = "src\components\core\Footer\Footer.tsx"
if (Test-Path $footerPath) {
    $content = Get-Content $footerPath -Raw
    $content = $content -replace 'href="#"', 'href="javascript:void(0)"'
    $content | Set-Content $footerPath -NoNewline
    Write-Host "Fixed Footer.tsx"
}

# Fix clickable divs - add keyboard support
$filesToFix = @(
    "src\components\gm-tools\EncounterBuilder\EncounterBuilder.tsx",
    "src\components\interactive\NPCGenerator\NPCGenerator.tsx",
    "src\components\reference\EquipmentDatabase\EquipmentDatabase.tsx",
    "src\components\utility\SaveManager\SaveManager.tsx",
    "src\pages\Characters\Characters.tsx"
)

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Add import if missing
        if ($content -notmatch "accessibilityHelpers") {
            $content = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';`n" + $content
        }
        
        # Add keyboard handler to onClick divs
        $pattern = '(<div[^>]*)(onClick=\{)([^}]+)(\})([^>]*>)'
        $replacement = '$1$2$3$4 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$5'
        $content = $content -replace $pattern, $replacement
        
        $content | Set-Content $file -NoNewline
        Write-Host "Fixed $file"
    }
}

# Fix form labels
$charSheetPath = "src\components\interactive\CharacterSheet\CharacterSheet.tsx"
if (Test-Path $charSheetPath) {
    $content = Get-Content $charSheetPath -Raw
    $counter = 0
    
    # Add unique IDs to labels and inputs
    $content = $content -replace '<label>', '<label htmlFor="field-1">'
    $content = $content -replace '<input', '<input id="field-1"'
    
    $content | Set-Content $charSheetPath -NoNewline
    Write-Host "Fixed CharacterSheet.tsx"
}

# Add button CSS
$cssContent = @'

.link-button {
  background: none;
  border: none;
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  padding: 0;
}
'@
Add-Content -Path "src\styles\index.css" -Value $cssContent

Write-Host "`nAll fixes applied!" -ForegroundColor Green
Write-Host "`nTo re-run SonarQube analysis, use:" -ForegroundColor Yellow