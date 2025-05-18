@echo off
echo Running SonarQube Scanner from Windows...

docker run --rm ^
    --network="cyberpunk-gm-screen-v2_sonarnet" ^
    -v "%CD%:/usr/src" ^
    -e SONAR_HOST_URL="http://sonarqube:9000" ^
    -e SONAR_TOKEN="sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566" ^
    sonarsource/sonar-scanner-cli ^
    -D"sonar.projectBaseDir=/usr/src" ^
    -D"sonar.projectKey=cyberpunk-gm-screen-v2" ^
    -D"sonar.sources=src" ^
    -D"sonar.inclusions=**/*.ts,**/*.tsx,**/*.js,**/*.jsx" ^
    -D"sonar.exclusions=**/*.test.*,**/*.spec.*,**/node_modules/**,**/dist/**"

echo.
echo Analysis complete! Check results at http://localhost:9000
pause