# Run SonarQube Analysis Script
Write-Host "Starting SonarQube Analysis..." -ForegroundColor Yellow

# Set project directory
$projectDir = "C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2"
cd $projectDir

# Run SonarQube analysis
Write-Host "Running SonarQube Scanner..." -ForegroundColor Cyan
docker run --rm `
    --network=cyberpunk-gm-screen-v2_sonarnet `
    -v "${projectDir}:/usr/src" `
    -w /usr/src `
    sonarsource/sonar-scanner-cli `
    -Dsonar.host.url=http://sonarqube:9000 `
    -Dsonar.login=sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566 `
    -Dsonar.projectKey=cyberpunk-gm-screen

Write-Host "Analysis complete!" -ForegroundColor Green
Write-Host "Check results at: http://localhost:9000/dashboard?id=cyberpunk-gm-screen" -ForegroundColor Cyan