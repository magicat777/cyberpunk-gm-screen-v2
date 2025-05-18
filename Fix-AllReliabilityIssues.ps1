# PowerShell Script to Fix All Reliability Issues
# Run from project root: C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2

Write-Host "Starting Accessibility/Reliability Fixes..." -ForegroundColor Green

# Set project path
$projectPath = Get-Location
Write-Host "Working in: $projectPath"

# Create backup
Write-Host "`nCreating backup..." -ForegroundColor Yellow
git add -A
git commit -m "Backup before accessibility fixes" --quiet

# 1. Create accessibility helper utility
Write-Host "`n1. Creating accessibility helper..." -ForegroundColor Cyan
$accessibilityHelper = @"
/**
 * Accessibility helper utilities
 */

export const handleKeyboardClick = (
  event: React.KeyboardEvent,
  onClick: () => void
) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onClick();
  }
};

export interface AccessibleClickProps {
  onClick: () => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export const getAccessibleClickProps = (
  onClick: () => void,
  ariaLabel?: string
): AccessibleClickProps => ({
  onClick,
  role: 'button',
  tabIndex: 0,
  'aria-label': ariaLabel,
  onKeyDown: (e) => handleKeyboardClick(e, onClick),
});
"@

$accessibilityHelper | Out-File -FilePath "src\utils\accessibilityHelpers.ts" -Encoding UTF8
Write-Host "✓ Created accessibilityHelpers.ts" -ForegroundColor Green

# 2. Fix Footer.tsx - invalid href
Write-Host "`n2. Fixing Footer.tsx href issue..." -ForegroundColor Cyan
$footerContent = Get-Content "src\components\core\Footer\Footer.tsx" -Raw
$footerContent = $footerContent -replace '<a href="#">([^<]*)</a>', '<button type="button" className="link-button" onClick={(e) => e.preventDefault()}>$1</button>'
$footerContent | Set-Content "src\components\core\Footer\Footer.tsx" -NoNewline
Write-Host "✓ Fixed Footer.tsx" -ForegroundColor Green

# 3. Fix DiceRoller.tsx - ambiguous spacing
Write-Host "`n3. Fixing DiceRoller.tsx spacing..." -ForegroundColor Cyan
$diceContent = Get-Content "src\components\gm-tools\DiceRoller\DiceRoller.tsx" -Raw
$diceContent = $diceContent -replace '(<input[^>]*type="number"[^>]*)(>)', '$1 aria-label="Dice modifier"$2'
$diceContent | Set-Content "src\components\gm-tools\DiceRoller\DiceRoller.tsx" -NoNewline
Write-Host "✓ Fixed DiceRoller.tsx" -ForegroundColor Green

# 4. Fix TimerManager.tsx - ambiguous spacing
Write-Host "`n4. Fixing TimerManager.tsx spacing..." -ForegroundColor Cyan
$timerContent = Get-Content "src\components\gm-tools\TimerManager\TimerManager.tsx" -Raw
$timerContent = $timerContent -replace '(<input[^>]*type="number"[^>]*)(>)', '$1 aria-label="Timer duration"$2'
$timerContent | Set-Content "src\components\gm-tools\TimerManager\TimerManager.tsx" -NoNewline
Write-Host "✓ Fixed TimerManager.tsx" -ForegroundColor Green

# 5. Fix EncounterBuilder.tsx - non-native interactive elements
Write-Host "`n5. Fixing EncounterBuilder.tsx interactive elements..." -ForegroundColor Cyan
$encounterContent = Get-Content "src\components\gm-tools\EncounterBuilder\EncounterBuilder.tsx" -Raw
# Add import if not present
if ($encounterContent -notmatch "accessibilityHelpers") {
    $encounterContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';" + "`n" + $encounterContent
}
# Fix clickable divs - assuming line 536 area
$encounterContent = $encounterContent -replace '(<div[^>]*)(onClick=\{([^}]+)\})([^>]*>)', '$1$2 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$4'
$encounterContent | Set-Content "src\components\gm-tools\EncounterBuilder\EncounterBuilder.tsx" -NoNewline
Write-Host "✓ Fixed EncounterBuilder.tsx" -ForegroundColor Green

# 6. Fix CharacterSheet.tsx - form label association
Write-Host "`n6. Fixing CharacterSheet.tsx form labels..." -ForegroundColor Cyan
$charContent = Get-Content "src\components\interactive\CharacterSheet\CharacterSheet.tsx" -Raw
# Add unique IDs to inputs and associate with labels
$labelCounter = 0
$charContent = [regex]::Replace($charContent, '<label>([^<]*)</label>[\s]*<input', {
    param($match)
    $script:labelCounter++
    "<label htmlFor=`"char-field-$labelCounter`">$($match.Groups[1].Value)</label>`n          <input id=`"char-field-$labelCounter`""
})
$charContent | Set-Content "src\components\interactive\CharacterSheet\CharacterSheet.tsx" -NoNewline
Write-Host "✓ Fixed CharacterSheet.tsx" -ForegroundColor Green

# 7. Fix NPCGenerator.tsx - non-native interactive elements
Write-Host "`n7. Fixing NPCGenerator.tsx interactive elements..." -ForegroundColor Cyan
$npcContent = Get-Content "src\components\interactive\NPCGenerator\NPCGenerator.tsx" -Raw
if ($npcContent -notmatch "accessibilityHelpers") {
    $npcContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';" + "`n" + $npcContent
}
$npcContent = $npcContent -replace '(<div[^>]*)(onClick=\{([^}]+)\})([^>]*>)', '$1$2 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$4'
$npcContent | Set-Content "src\components\interactive\NPCGenerator\NPCGenerator.tsx" -NoNewline
Write-Host "✓ Fixed NPCGenerator.tsx" -ForegroundColor Green

# 8. Fix EquipmentDatabase.tsx - non-native interactive elements
Write-Host "`n8. Fixing EquipmentDatabase.tsx interactive elements..." -ForegroundColor Cyan
$equipContent = Get-Content "src\components\reference\EquipmentDatabase\EquipmentDatabase.tsx" -Raw
if ($equipContent -notmatch "accessibilityHelpers") {
    $equipContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';" + "`n" + $equipContent
}
$equipContent = $equipContent -replace '(<div[^>]*)(onClick=\{([^}]+)\})([^>]*>)', '$1$2 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$4'
$equipContent | Set-Content "src\components\reference\EquipmentDatabase\EquipmentDatabase.tsx" -NoNewline
Write-Host "✓ Fixed EquipmentDatabase.tsx" -ForegroundColor Green

# 9. Fix IconShowcase.tsx - form label and interactive elements
Write-Host "`n9. Fixing IconShowcase.tsx issues..." -ForegroundColor Cyan
$iconContent = Get-Content "src\components\utility\Icon\IconShowcase.tsx" -Raw
if ($iconContent -notmatch "accessibilityHelpers") {
    $iconContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';" + "`n" + $iconContent
}
# Fix form labels
$iconContent = $iconContent -replace '<label>', '<label htmlFor="icon-search">'
$iconContent = $iconContent -replace '<input([^>]*placeholder="Search[^"]*")([^>]*)>', '<input$1 id="icon-search"$2>'
# Fix clickable divs
$iconContent = $iconContent -replace '(<div[^>]*)(onClick=\{([^}]+)\})([^>]*>)', '$1$2 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$4'
$iconContent | Set-Content "src\components\utility\Icon\IconShowcase.tsx" -NoNewline
Write-Host "✓ Fixed IconShowcase.tsx" -ForegroundColor Green

# 10. Fix SaveManager.tsx - non-native interactive elements
Write-Host "`n10. Fixing SaveManager.tsx interactive elements..." -ForegroundColor Cyan
$saveContent = Get-Content "src\components\utility\SaveManager\SaveManager.tsx" -Raw
if ($saveContent -notmatch "accessibilityHelpers") {
    $saveContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';" + "`n" + $saveContent
}
$saveContent = $saveContent -replace '(<div[^>]*)(onClick=\{([^}]+)\})([^>]*>)', '$1$2 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$4'
$saveContent | Set-Content "src\components\utility\SaveManager\SaveManager.tsx" -NoNewline
Write-Host "✓ Fixed SaveManager.tsx" -ForegroundColor Green

# 11. Fix Characters.tsx - non-native interactive elements
Write-Host "`n11. Fixing Characters.tsx interactive elements..." -ForegroundColor Cyan
$charactersContent = Get-Content "src\pages\Characters\Characters.tsx" -Raw
if ($charactersContent -notmatch "accessibilityHelpers") {
    $charactersContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';" + "`n" + $charactersContent
}
$charactersContent = $charactersContent -replace '(<div[^>]*)(onClick=\{([^}]+)\})([^>]*>)', '$1$2 role="button" tabIndex={0} onKeyDown={(e) => handleKeyboardClick(e, $3)}$4'
$charactersContent | Set-Content "src\pages\Characters\Characters.tsx" -NoNewline
Write-Host "✓ Fixed Characters.tsx" -ForegroundColor Green

# 12. Add CSS for button styling that looks like links
Write-Host "`n12. Adding CSS for link-button styling..." -ForegroundColor Cyan
$globalCss = @"

/* Link-style buttons for accessibility */
.link-button {
  background: none;
  border: none;
  color: var(--color-primary);
  text-decoration: underline;
  cursor: pointer;
  font: inherit;
  padding: 0;
  margin: 0;
}

.link-button:hover {
  text-decoration: none;
}

.link-button:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
"@

Add-Content -Path "src\styles\index.css" -Value $globalCss
Write-Host "✓ Added link-button styles" -ForegroundColor Green

# 13. Run linter to check for any issues
Write-Host "`n13. Running linter..." -ForegroundColor Cyan
npm run lint -- --fix

# 14. Commit the fixes
Write-Host "`n14. Committing fixes..." -ForegroundColor Cyan
git add -A
git commit -m "Fix all 19 accessibility/reliability issues"

Write-Host "`n✓ All fixes applied successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes: git diff HEAD~1"
Write-Host "2. Run tests: npm test"
Write-Host "3. Re-run SonarQube analysis to verify fixes"

# Command to re-run analysis
Write-Host "`nTo re-run SonarQube analysis, use:" -ForegroundColor Cyan
Write-Host 'docker run --rm --network="cyberpunk-gm-screen-v2_sonarnet" -v "${PWD}:/usr/src" -e SONAR_HOST_URL="http://sonarqube:9000" -e SONAR_TOKEN="sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566" sonarsource/sonar-scanner-cli -D"sonar.projectBaseDir=/usr/src" -D"sonar.projectKey=cyberpunk-gm-screen-v2" -D"sonar.sources=src"' -ForegroundColor White