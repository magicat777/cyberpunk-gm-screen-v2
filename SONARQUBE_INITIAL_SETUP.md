# SonarQube Initial Setup

## 1. Access SonarQube
Open your browser and go to: http://localhost:9000

## 2. Initial Login
- Username: `admin`
- Password: `admin`
- You'll be prompted to change the password - choose a secure one

## 3. Create Your Project

### Manual Project Creation
1. Click "Create Project" (or "+" icon)
2. Choose "Manually"
3. Enter project details:
   - Project key: `cyberpunk-gm-screen-v2`
   - Display name: `Cyberpunk GM Screen v2`
   - Main branch name: `main`
4. Click "Set Up"

## 4. Generate Token
1. Choose "Locally"
2. Generate a token:
   - Token name: `cyberpunk-scanner`
   - Type: "Project Analysis Token"
3. Copy and save the token (you won't see it again!)

## 5. Configure Scanner
Save your token for use with the scanner:
```bash
# Create a .env file for the token (don't commit this!)
echo "SONAR_TOKEN=your-token-here" > .env.sonarqube

# Or export it temporarily
export SONAR_TOKEN="your-token-here"
```

## 6. Run First Analysis

### Option 1: Using Docker Scanner
```bash
# Make sure you're in the project root
cd /app/data/projects/cyberpunk-gm-screen-v2

# Run the scanner (as root if needed)
docker run \
  --rm \
  --network="host" \
  -e SONAR_HOST_URL="http://localhost:9000" \
  -e SONAR_LOGIN="$SONAR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectBaseDir=/usr/src
```

### Option 2: Using the Provided Script
```bash
# As root if Docker requires it
su -
cd /app/data/projects/cyberpunk-gm-screen-v2
export SONAR_TOKEN="your-token-here"
./scripts/run-sonar-scanner.sh
```

## 7. View Results
1. Go back to http://localhost:9000
2. Click on your project
3. You'll see:
   - Code quality metrics
   - Security vulnerabilities
   - Code coverage (if tests were run)
   - Technical debt

## 8. Configure Quality Gates
1. Go to "Quality Gates" in the top menu
2. Create a new quality gate or modify the default
3. Set thresholds for:
   - Coverage on new code (e.g., 80%)
   - Duplicated lines (e.g., <3%)
   - Security vulnerabilities (0)
   - Maintainability rating (A)

## 9. Set Up Webhooks (Optional)
For CI/CD integration:
1. Go to Project Settings → Webhooks
2. Add webhook for your CI/CD system
3. Configure notifications

## Quick Test Commands

```bash
# Check if SonarQube is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:9000

# Check project exists (after creation)
curl -u admin:your-new-password http://localhost:9000/api/projects/search?projects=cyberpunk-gm-screen-v2
```

## Troubleshooting

### Scanner Can't Connect
- Ensure SonarQube is running: `docker ps`
- Check network: Use `--network="host"` for scanner
- Verify URL: http://localhost:9000

### Authentication Issues
- Token must be valid and active
- Use token, not username/password for scanner
- Check token permissions

### Analysis Fails
- Check `sonar-project.properties` configuration
- Ensure source paths are correct
- Verify file exclusions

## Next Steps
1. Review initial scan results
2. Fix critical issues
3. Set up CI/CD integration
4. Configure team permissions
5. Create custom rules if needed