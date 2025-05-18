# PowerShell Script to Fix Final 5 Reliability Issues
Write-Host "Fixing final 5 reliability issues..." -ForegroundColor Green

# Fix 1: Footer.tsx - Convert invalid href to button
Write-Host "1. Fixing Footer.tsx..." -ForegroundColor Cyan
$footerContent = Get-Content "src\components\core\Footer\Footer.tsx" -Raw
$footerContent = $footerContent -replace '<a\s+href="javascript:void\(0\)"([^>]*)>([^<]*)</a>', '<button type="button" className="link-button"$1>$2</button>'
$footerContent | Set-Content "src\components\core\Footer\Footer.tsx" -NoNewline
Write-Host "   ✓ Fixed Footer.tsx" -ForegroundColor Green

# Fix 2: TimerManager.tsx - Add aria-label for spacing
Write-Host "2. Fixing TimerManager.tsx..." -ForegroundColor Cyan
$timerContent = Get-Content "src\components\gm-tools\TimerManager\TimerManager.tsx" -Raw
$timerContent = $timerContent -replace '(<input[^>]*type="number"[^>]*)(>)', '$1 aria-label="Timer duration"$2'
$timerContent | Set-Content "src\components\gm-tools\TimerManager\TimerManager.tsx" -NoNewline
Write-Host "   ✓ Fixed TimerManager.tsx" -ForegroundColor Green

# Fix 3-5: IconShowcase.tsx - Multiple issues
Write-Host "3-5. Fixing IconShowcase.tsx..." -ForegroundColor Cyan
$iconContent = Get-Content "src\components\utility\Icon\IconShowcase.tsx" -Raw

# Fix form label association
$iconContent = $iconContent -replace '<label>', '<label htmlFor="icon-search">'
$iconContent = $iconContent -replace '<input([^>]*placeholder="Search[^"]*"[^>]*)>', '<input$1 id="icon-search">'

# Convert clickable divs to buttons
$iconContent = $iconContent -replace '<div([^>]*)(onClick=\{[^}]+\})([^>]*)>', '<button type="button"$1$2$3>'

# Add keyboard handler if needed
if ($iconContent -notmatch "accessibilityHelpers") {
    $iconContent = "import { handleKeyboardClick } from '@/utils/accessibilityHelpers';`n" + $iconContent
}

$iconContent | Set-Content "src\components\utility\Icon\IconShowcase.tsx" -NoNewline
Write-Host "   ✓ Fixed IconShowcase.tsx" -ForegroundColor Green

Write-Host "`n✓ All 5 remaining issues fixed!" -ForegroundColor Green
Write-Host "`nRun SonarQube analysis again to verify:" -ForegroundColor Yellow