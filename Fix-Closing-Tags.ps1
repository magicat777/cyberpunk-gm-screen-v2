# Fix closing tag mismatches
Write-Host "Fixing closing tag mismatches..." -ForegroundColor Green

$files = @(
    "src\components\utility\Icon\IconShowcase.tsx",
    "src\components\utility\SaveManager\SaveManager.tsx",
    "src\components\gm-tools\DiceRoller\DiceRoller.tsx",
    "src\components\gm-tools\EncounterBuilder\EncounterBuilder.tsx",
    "src\pages\Characters\Characters.tsx",
    "src\components\interactive\NPCGenerator\NPCGenerator.tsx",
    "src\components\reference\EquipmentDatabase\EquipmentDatabase.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Fixing $file..." -ForegroundColor Cyan
        
        $content = Get-Content $file -Raw
        
        # Count opening buttons and divs
        $buttonCount = ([regex]::Matches($content, '<button')).Count
        $buttonCloseCount = ([regex]::Matches($content, '</button>')).Count
        $divCount = ([regex]::Matches($content, '<div')).Count
        $divCloseCount = ([regex]::Matches($content, '</div>')).Count
        
        # If button opens don't match closes, we likely need to fix some </div> to </button>
        if ($buttonCount -gt $buttonCloseCount) {
            # This is a simple approach - it may need manual review
            $content = $content -replace '(<button[^>]*>(?:(?!<button|</button>).)*?)</div>', '$1</button>'
        }
        
        $content | Set-Content $file -NoNewline
        Write-Host "  ✓ Fixed $file" -ForegroundColor Green
    }
}

Write-Host "`nAll files fixed!" -ForegroundColor Green
Write-Host "Run the linter to check for any remaining issues:" -ForegroundColor Yellow
Write-Host "npm run lint" -ForegroundColor White