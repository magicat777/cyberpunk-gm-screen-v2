# PowerShell script to fix accessibility issues
$projectPath = "C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2"
cd $projectPath

# 1. Fix Footer.tsx - href issue
$footerPath = "src\components\core\Footer\Footer.tsx"
$footerContent = Get-Content $footerPath -Raw
$footerContent = $footerContent -replace '<a href="#">', '<button className="link-button">'
$footerContent = $footerContent -replace '</a>', '</button>'
Set-Content -Path $footerPath -Value $footerContent

# 2. Fix spacing issues in DiceRoller.tsx and TimerManager.tsx
$diceRollerPath = "src\components\gm-tools\DiceRoller\DiceRoller.tsx"
$diceContent = Get-Content $diceRollerPath -Raw
# Add aria-label to inputs that need spacing clarification
$diceContent = $diceContent -replace '(<input[^>]*)(>)', '$1 aria-label="Dice modifier"$2'
Set-Content -Path $diceRollerPath -Value $diceContent

# 3. Fix interactive elements with onClick but no keyboard support
$files = @(
    "src\components\gm-tools\EncounterBuilder\EncounterBuilder.tsx",
    "src\components\interactive\NPCGenerator\NPCGenerator.tsx",
    "src\components\reference\EquipmentDatabase\EquipmentDatabase.tsx",
    "src\components\utility\SaveManager\SaveManager.tsx",
    "src\pages\Characters\Characters.tsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    # Add keyboard handler import
    if ($content -notmatch "import.*accessibilityHelpers") {
        $content = "import { getAccessibleClickProps } from '@/utils/accessibilityHelpers';`n" + $content
    }
    # Replace div onClick with accessible version
    $content = $content -replace '(<div[^>]*)(onClick=\{[^}]+\})([^>]*>)', '$1{...getAccessibleClickProps($2)}$3'
    Set-Content -Path $file -Value $content
}

# 4. Fix form label associations
$charSheetPath = "src\components\interactive\CharacterSheet\CharacterSheet.tsx"
$charContent = Get-Content $charSheetPath -Raw
$charContent = $charContent -replace '<label>', '<label htmlFor="character-field">'
$charContent = $charContent -replace '(<input[^>]*)(>)', '$1 id="character-field"$2'
Set-Content -Path $charSheetPath -Value $charContent

Write-Host "Accessibility fixes applied. Run analysis again to verify."