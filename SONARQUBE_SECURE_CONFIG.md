# SonarQube Secure Configuration

## Password Updated ✅
Admin password has been changed from default.

## Environment File Created
Created `.env.sonarqube` with credentials.
**⚠️ This file contains sensitive data - DO NOT commit to version control!**

## Security Best Practices

### 1. Protect Credentials
```bash
# Ensure .env.sonarqube is in .gitignore
grep -q ".env.sonarqube" .gitignore || echo ".env.sonarqube" >> .gitignore

# Set restrictive permissions
chmod 600 .env.sonarqube
```

### 2. Use Tokens for Analysis
- Never use username/password for scanner
- Always use project tokens
- Rotate tokens regularly

### 3. Generate Analysis Token
1. Login to SonarQube
2. Go to: My Account → Security → Generate Tokens
3. Create token with name: `cyberpunk-scanner`
4. Add to `.env.sonarqube`: `SONAR_TOKEN=your-token-here`

### 4. Secure Scanner Usage
```bash
# Load credentials securely
source .env.sonarqube

# Run scanner with token only
docker run \
    --rm \
    --network="cyberpunk-gm-screen-v2_sonarnet" \
    -e SONAR_HOST_URL="http://sonarqube:9000" \
    -e SONAR_LOGIN="$SONAR_TOKEN" \
    -v "$(pwd):/usr/src" \
    sonarsource/sonar-scanner-cli
```

## Next Steps
1. Generate analysis token in SonarQube UI
2. Add token to `.env.sonarqube`
3. Run first analysis with token
4. Configure quality gates
5. Set up user permissions

## CI/CD Security
For GitHub Actions:
1. Add token as repository secret: `SONAR_TOKEN`
2. Never hardcode credentials
3. Use environment variables

## Backup Configuration
```bash
# Backup important config
cp .env.sonarqube .env.sonarqube.backup
chmod 600 .env.sonarqube.backup
```

---
**Remember**: Keep credentials secure and use tokens for all automated processes!