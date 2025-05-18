# SonarQube Authentication Troubleshooting

## Issue: HTTP 401 Unauthorized

The scanner is failing with authentication error. Let's fix this:

### 1. Verify Token Format

Check your token in `.env.sonarqube`:
```bash
grep SONAR_TOKEN .env.sonarqube
```

Should look like:
```
SONAR_TOKEN=sqa_163e0749adbf81e9c1ca5d4514a204c98ee604ab
```

### 2. Test Token Manually

```bash
# Load environment
source .env.sonarqube

# Test with curl
curl -u "$SONAR_TOKEN:" http://localhost:9000/api/authentication/validate
```

### 3. Try Direct Scanner Command

```bash
# As root
cd /app/data/projects/cyberpunk-gm-screen-v2
source .env.sonarqube

docker run \
    --rm \
    --network="cyberpunk-gm-screen-v2_sonarnet" \
    -v "$(pwd):/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectBaseDir=/usr/src \
    -Dsonar.host.url=http://sonarqube:9000 \
    -Dsonar.token=$SONAR_TOKEN \
    -Dsonar.projectKey=cyberpunk-gm-screen-v2
```

### 4. Create Project First

Make sure the project exists in SonarQube:
1. Login to http://localhost:9000
2. Create project manually
3. Project key: `cyberpunk-gm-screen-v2`

### 5. Alternative Token Method

Try creating a user token instead of project token:
1. My Account → Security → Generate Tokens
2. Create "User Token" type
3. Update `.env.sonarqube`

### 6. Debug Scanner

Run with debug logging:
```bash
docker run \
    --rm \
    --network="cyberpunk-gm-screen-v2_sonarnet" \
    -v "$(pwd):/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectBaseDir=/usr/src \
    -Dsonar.host.url=http://sonarqube:9000 \
    -Dsonar.token=$SONAR_TOKEN \
    -Dsonar.projectKey=cyberpunk-gm-screen-v2 \
    -Dsonar.verbose=true
```

### 7. Check SonarQube Logs

```bash
docker logs sonarqube | tail -50
```

### Common Fixes

1. **Wrong Token Type**: Use "User Token" not "Project Token"
2. **Project Not Created**: Create project in UI first
3. **Network Issues**: Verify container network connectivity
4. **Token Format**: No quotes, spaces, or special characters

---
Try the direct scanner command above first to isolate the issue!