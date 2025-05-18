# Run SonarQube Analysis Now

## Ready to Analyze! ✅

- Project created: `cyberpunk-gm-screen-v2`
- Token configured: `sqp_4e4f5fff...` (project token)
- Scanner ready

## Run Analysis Command

```bash
# As root
su -

# Navigate to project
cd /app/data/projects/cyberpunk-gm-screen-v2

# Run the scanner
./scripts/run-sonar-scanner-container.sh
```

## What to Expect

1. **Token verification**: Should show "Token loaded successfully"
2. **ESLint report**: Will generate (ignore TypeScript version warning)
3. **Scanner execution**: Takes 1-3 minutes
4. **Success message**: "ANALYSIS SUCCESSFUL"

## If It Still Fails

Try the direct scanner:
```bash
./scripts/run-sonar-scanner-direct.sh
```

Or run with explicit parameters:
```bash
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

## View Results

Once successful, see your analysis at:
**http://localhost:9000/dashboard?id=cyberpunk-gm-screen-v2**

---
**The project token is now configured. Run the command above!**