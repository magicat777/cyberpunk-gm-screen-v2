# SonarQube Project Setup Guide

## Creating the Project

### For Local Analysis: Choose "Manually"

1. In SonarQube UI, click "Create project"
2. Select **"Manually"** (not from GitHub)
3. Enter:
   - Project key: `cyberpunk-gm-screen-v2`
   - Display name: `Cyberpunk GM Screen v2`
   - Main branch: `main`
4. Click "Set up"

### Why Manual Instead of GitHub Import?

1. **Local Development**: You're running analysis locally, not from GitHub
2. **No GitHub Integration Needed**: Scanner runs from your machine
3. **Simpler Setup**: No OAuth/webhooks configuration required
4. **Immediate Testing**: Can run analysis right away

## After Creating Project

### 1. Choose Analysis Method
Select **"Locally"** when asked how you want to analyze

### 2. Generate Token
- Token name: `local-scanner`
- Type: Will be a project-specific token
- **Copy and save the token!**

### 3. Update Your Configuration
```bash
# Update .env.sonarqube with new token
nano .env.sonarqube
# Replace SONAR_TOKEN value
```

### 4. Run Analysis
```bash
# As root
su -
cd /app/data/projects/cyberpunk-gm-screen-v2
./scripts/run-sonar-scanner-container.sh
```

## GitHub Integration (Optional, Later)

If you want GitHub integration later for CI/CD:
1. Set up GitHub App in SonarQube
2. Configure webhooks
3. Add GitHub Actions workflow
4. Use different tokens for CI/CD

But for now, **manual project creation** is the correct choice for local analysis.

---
**Create the project manually in SonarQube UI, then generate a project token.**