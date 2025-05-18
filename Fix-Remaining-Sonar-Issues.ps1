# Fix Remaining SonarQube Issues
Write-Host "Fixing remaining SonarQube issues..." -ForegroundColor Yellow

# Fix 1: Remove redundant role="button" attributes
Write-Host "Removing redundant role attributes..." -ForegroundColor Cyan
$files = @(
    "src/components/gm-tools/EncounterBuilder/EncounterBuilder.tsx",
    "src/components/interactive/NPCGenerator/NPCGenerator.tsx",
    "src/components/reference/EquipmentDatabase/EquipmentDatabase.tsx",
    "src/pages/Characters/Characters.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace '\s+role="button"(?=\s|>)', ''
        Set-Content $file $content -NoNewline
        Write-Host "Fixed $file" -ForegroundColor Green
    }
}

# Fix 2: Remove unused imports
Write-Host "Removing unused imports..." -ForegroundColor Cyan
$files = @(
    "src/components/utility/Icon/IconShowcase.tsx",
    "src/components/utility/SaveManager/SaveManager.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $content = $content -replace "import \{ handleKeyboardClick \} from '@/utils/accessibilityHelpers';\s*", ""
        Set-Content $file $content -NoNewline
        Write-Host "Fixed $file" -ForegroundColor Green
    }
}

# Fix 3: Replace || with ?? for nullish coalescing
Write-Host "Applying nullish coalescing..." -ForegroundColor Cyan
$files = @(
    "src/components/interactive/NPCGenerator/NPCGenerator.tsx",
    "src/components/reference/EquipmentDatabase/EquipmentDatabase.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace simple cases of value || defaultValue with value ?? defaultValue
        $content = $content -replace '(\w+)\s*\|\|\s*([\'"][\w\s]+[\'"])', '$1 ?? $2'
        $content = $content -replace '(\w+\.[\w\.]+)\s*\|\|\s*([\'"][\w\s]+[\'"])', '$1 ?? $2'
        
        Set-Content $file $content -NoNewline
        Write-Host "Fixed $file" -ForegroundColor Green
    }
}

# Fix 4: Fix interactive div elements in SaveManager
Write-Host "Fixing SaveManager interactive elements..." -ForegroundColor Cyan
$file = "src/components/utility/SaveManager/SaveManager.tsx"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Convert overlay div to button with proper styling
    $content = $content -replace '<div className=\{styles\.overlay\} onClick=\{.*?\}>', '<button className={styles.overlay} onClick={() => setIsOpen(false)} aria-label="Close modal">'
    $content = $content -replace '<div className=\{styles\.modal\} onClick=\{\(e\) => e\.stopPropagation\(\)\}>', '<div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">'
    
    # Fix closing tags
    $content = $content -replace '(\s+)<\/div>(\s+)<\/div>(\s+)\{\}', '$1</div>$2</button>$3)}'
    
    Set-Content $file $content -NoNewline
    Write-Host "Fixed $file" -ForegroundColor Green
}

# Fix 5: Fix spacing issue in DiceRoller
Write-Host "Fixing DiceRoller spacing..." -ForegroundColor Cyan
$file = "src/components/gm-tools/DiceRoller/DiceRoller.tsx"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Add proper spacing comment or element between inputs
    $content = $content -replace '(\s+)(<input[^>]+id="exploding"[^>]+>)', '$1{/* Checkbox for exploding dice */}$1$2'
    
    Set-Content $file $content -NoNewline
    Write-Host "Fixed $file" -ForegroundColor Green
}

# Fix 6: Fix the redundant type assertion
Write-Host "Fixing redundant type assertion..." -ForegroundColor Cyan
$file = "src/components/gm-tools/DiceRoller/DiceRoller.tsx"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Remove unnecessary type assertion (line 172)
    $content = $content -replace 'formatRollString\(getMostRecentRoll\(\)!\)', 'formatRollString(getMostRecentRoll())'
    
    Set-Content $file $content -NoNewline
    Write-Host "Fixed $file" -ForegroundColor Green
}

# Fix 7: Fix the div with onClick in EncounterBuilder
Write-Host "Fixing EncounterBuilder interactive element..." -ForegroundColor Cyan
$file = "src/components/gm-tools/EncounterBuilder/EncounterBuilder.tsx"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    
    # Convert the interactive div to a button
    $pattern = '<div\s+onClick=\{\(e\) => \{[\s\S]*?stopPropagation[\s\S]*?\}\}[\s\S]*?className=\{styles\.useTemplate\}'
    $replacement = '<button onClick={(e) => { e.stopPropagation(); loadTemplate(template.id); setActiveTab(''builder''); }} className={styles.useTemplate} aria-label="Use this template"'
    
    $content = $content -replace $pattern, $replacement
    
    # Fix closing tag
    $content = $content -replace '(\s+)<\/div>(\s+)<\/button>', '$1</button>$2</button>'
    
    Set-Content $file $content -NoNewline
    Write-Host "Fixed $file" -ForegroundColor Green
}

Write-Host "`nAll fixes applied!" -ForegroundColor Green
Write-Host "Run 'npm run lint' and 'npm run build' to verify" -ForegroundColor Yellow