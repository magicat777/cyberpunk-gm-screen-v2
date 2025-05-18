# Fix Final SonarQube Issues
Write-Host "Fixing final SonarQube issues..." -ForegroundColor Yellow

# Fix 1: Replace || with ?? for nullish coalescing
Write-Host "Applying nullish coalescing operators..." -ForegroundColor Cyan

$files = @(
    "src/components/interactive/NPCGenerator/NPCGenerator.tsx",
    "src/components/reference/EquipmentDatabase/EquipmentDatabase.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace patterns like: value || 'default' with value ?? 'default'
        $content = $content -replace '(\w+(?:\.\w+)*)\s*\|\|\s*(["\'][^"\']+["\'])', '$1 ?? $2'
        $content = $content -replace '(\w+(?:\.\w+)*)\s*\|\|\s*(\d+)', '$1 ?? $2'
        $content = $content -replace '(\w+(?:\.\w+)*)\s*\|\|\s*(\w+)', '$1 ?? $2'
        
        Set-Content $file $content -NoNewline
        Write-Host "Fixed nullish coalescing in $file" -ForegroundColor Green
    }
}

Write-Host "`nAll fixes applied!" -ForegroundColor Green
Write-Host "Note: Deeply nested functions and SaveManager dialog issues require manual refactoring" -ForegroundColor Yellow