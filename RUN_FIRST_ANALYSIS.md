# Run First SonarQube Analysis

## Prerequisites ✅
- SonarQube is running
- Token is configured in `.env.sonarqube`
- Password has been changed

## Run Analysis

### As Root User
```bash
# 1. Switch to root
su -

# 2. Navigate to project
cd /app/data/projects/cyberpunk-gm-screen-v2

# 3. Run the scanner
./scripts/run-sonar-scanner-container.sh
```

### Or Direct Command
```bash
# As root, in one command
su -c "cd /app/data/projects/cyberpunk-gm-screen-v2 && ./scripts/run-sonar-scanner-container.sh"
```

## What Will Happen

1. Script will load token from `.env.sonarqube`
2. Generate test coverage (if possible)
3. Create ESLint report
4. Run SonarQube scanner
5. Upload results to SonarQube

## Expected Output

You should see:
```
Running SonarQube Scanner (Container Environment)
===============================================
Generating test coverage...
Generating ESLint report...
Running SonarQube scanner...
Using network: cyberpunk-gm-screen-v2_sonarnet
SonarQube URL: http://sonarqube:9000
...
ANALYSIS SUCCESSFUL
```

## View Results

After completion, view your results at:
**http://localhost:9000/dashboard?id=cyberpunk-gm-screen-v2**

## First Analysis Insights

Look for:
- Code Coverage percentage
- Security vulnerabilities
- Code smells
- Technical debt
- Duplications

## Troubleshooting

If analysis fails:

1. **Check Docker Access**
   ```bash
   docker ps | grep sonarqube
   ```

2. **Verify Token**
   ```bash
   grep SONAR_TOKEN .env.sonarqube
   ```

3. **Check Logs**
   ```bash
   docker logs sonarqube
   ```

4. **Test Network**
   ```bash
   docker run --rm --network="cyberpunk-gm-screen-v2_sonarnet" busybox ping -c 1 sonarqube
   ```

---
**Ready to run! Execute the commands above as root.**