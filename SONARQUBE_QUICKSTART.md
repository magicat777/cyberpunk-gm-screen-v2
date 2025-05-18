# SonarQube Quick Start

## 1. Start SonarQube (Simple Version)
```bash
docker-compose -f docker-compose.sonarqube-simple.yml up -d
```

## 2. Wait for Startup
Wait about 60 seconds, then visit: http://localhost:9000

## 3. Login
- Username: `admin`
- Password: `admin`
- Change password when prompted

## 4. Create Project
1. Click "Manually" on the Projects page
2. Project key: `cyberpunk-gm-screen-v2`
3. Display name: `Cyberpunk GM Screen v2`
4. Main branch: `main`

## 5. Generate Token
1. Name: `cyberpunk-scanner`
2. Type: `Project Analysis Token`
3. Save the token!

## 6. Run Analysis
```bash
# Set your token
export SONAR_TOKEN="your-token-here"

# Run scanner
docker run \
  --rm \
  --network="host" \
  -e SONAR_HOST_URL="http://localhost:9000" \
  -e SONAR_LOGIN="$SONAR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectBaseDir=/usr/src
```

## 7. View Results
Go to: http://localhost:9000/dashboard?id=cyberpunk-gm-screen-v2

## Stop SonarQube
```bash
docker-compose -f docker-compose.sonarqube-simple.yml down
```

## Full Setup
For production setup with PostgreSQL:
```bash
./scripts/setup-sonarqube.sh
```