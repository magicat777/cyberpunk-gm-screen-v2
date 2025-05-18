# SonarQube Scanner - Windows PowerShell Commands

## Complete Command for Windows PowerShell

```powershell
# Navigate to your project directory
cd C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2

# Run the scanner - option 1 (using container network)
docker run --rm `
    --network="cyberpunk-gm-screen-v2_sonarnet" `
    -v "${PWD}:/usr/src" `
    -e SONAR_HOST_URL="http://sonarqube:9000" `
    -e SONAR_TOKEN="sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566" `
    sonarsource/sonar-scanner-cli `
    -Dsonar.projectBaseDir=/usr/src `
    -Dsonar.projectKey=cyberpunk-gm-screen-v2 `
    -Dsonar.sources=src
```

## Alternative: Using host network

```powershell
# Run the scanner - option 2 (using host network)
docker run --rm `
    --network="host" `
    -v "${PWD}:/usr/src" `
    -e SONAR_HOST_URL="http://localhost:9000" `
    -e SONAR_TOKEN="sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566" `
    sonarsource/sonar-scanner-cli `
    -Dsonar.projectBaseDir=/usr/src `
    -Dsonar.projectKey=cyberpunk-gm-screen-v2 `
    -Dsonar.sources=src
```

## One-line version (if you prefer)

```powershell
docker run --rm --network="cyberpunk-gm-screen-v2_sonarnet" -v "${PWD}:/usr/src" -e SONAR_HOST_URL="http://sonarqube:9000" -e SONAR_TOKEN="sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566" sonarsource/sonar-scanner-cli -Dsonar.projectBaseDir=/usr/src -Dsonar.projectKey=cyberpunk-gm-screen-v2 -Dsonar.sources=src
```

## Troubleshooting

### If network not found:
```powershell
# List networks
docker network ls

# If cyberpunk-gm-screen-v2_sonarnet doesn't exist, use:
docker run --rm --network="host" ...
```

### If permission denied:
```powershell
# Run PowerShell as Administrator
# Or ensure Docker Desktop is running
```

### Check SonarQube is accessible:
```powershell
# Test connection
curl http://localhost:9000
# Or open in browser: http://localhost:9000
```

## Expected Output

You should see:
```
INFO: Scanner configuration file: /opt/sonar-scanner/conf/sonar-scanner.properties
INFO: Project root configuration file: NONE
INFO: SonarScanner CLI
...
INFO: ANALYSIS SUCCESSFUL
```

Then view results at: http://localhost:9000/dashboard?id=cyberpunk-gm-screen-v2