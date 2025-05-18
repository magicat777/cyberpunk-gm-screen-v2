# Run Tests with Coverage Script
Write-Host "Running tests with coverage..." -ForegroundColor Yellow

# Set project directory
$projectDir = "C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2"
cd $projectDir

# Clean coverage directory if it exists
if (Test-Path "coverage") {
    Write-Host "Cleaning coverage directory..." -ForegroundColor Cyan
    Remove-Item -Path "coverage" -Recurse -Force
}

# Run tests with coverage
Write-Host "Running tests..." -ForegroundColor Cyan
npm test -- --coverage --run

# Check if coverage was generated
if (Test-Path "coverage/lcov.info") {
    Write-Host "Coverage report generated successfully!" -ForegroundColor Green
    Write-Host "Coverage saved to: $projectDir\coverage\lcov.info" -ForegroundColor Cyan
    
    # Display coverage summary
    Write-Host "`nCoverage Summary:" -ForegroundColor Yellow
    Get-Content "coverage/lcov.info" | Select-String -Pattern "SF:|DA:" | ForEach-Object {
        Write-Host $_ -ForegroundColor Gray
    }
} else {
    Write-Host "Coverage report not generated" -ForegroundColor Red
}