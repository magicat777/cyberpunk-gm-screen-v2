# SonarQube Quick Start - Container Setup

## Current Status
✅ SonarQube is running at IP: 172.22.0.3:9000
✅ PostgreSQL database is running

## Access SonarQube

### From Host Browser
http://localhost:9000

### From Within Container
http://172.22.0.3:9000

## Initial Setup Steps

### 1. Login
- Username: `admin`
- Password: `admin`
- Change password when prompted

### 2. Create Project
1. Click "Create project manually"
2. Project key: `cyberpunk-gm-screen-v2`
3. Display name: `Cyberpunk GM Screen v2`

### 3. Generate Token
1. Name: `cyberpunk-scanner`
2. Type: Project Analysis Token
3. Copy and save the token!

### 4. Run Scanner

Since we're in a container, use the container network:

```bash
# Set your token
export SONAR_TOKEN="your-token-here"

# Run scanner (as root if needed)
docker run \
  --rm \
  --network="cyberpunk-gm-screen-v2_sonarnet" \
  -e SONAR_HOST_URL="http://sonarqube:9000" \
  -e SONAR_LOGIN="$SONAR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectBaseDir=/usr/src
```

## Container Network Details

- Network: `cyberpunk-gm-screen-v2_sonarnet`
- SonarQube hostname: `sonarqube`
- Internal URL: `http://sonarqube:9000`
- Container IP: `172.22.0.3`

## Verification Commands

```bash
# Check SonarQube is running
docker ps | grep sonarqube

# Test connection from scanner network
docker run --rm --network="cyberpunk-gm-screen-v2_sonarnet" alpine wget -qO- http://sonarqube:9000/api/system/status

# View logs
docker logs sonarqube
```

## Quick Analysis Command

```bash
# One-liner (replace YOUR_TOKEN)
docker run --rm --network="cyberpunk-gm-screen-v2_sonarnet" \
  -e SONAR_HOST_URL="http://sonarqube:9000" \
  -e SONAR_LOGIN="YOUR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectBaseDir=/usr/src
```