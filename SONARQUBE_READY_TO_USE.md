# SonarQube is Ready!

## 🚀 Quick Start

### 1. Access SonarQube
Open in your browser: **http://localhost:9000**

### 2. Login
- Username: `admin`
- Password: `admin`
- **Important**: Change the password immediately!

### 3. Create Project
1. Click "Create project manually"
2. Key: `cyberpunk-gm-screen-v2`
3. Name: `Cyberpunk GM Screen v2`

### 4. Generate Token
1. Choose "Locally"
2. Token name: `scanner`
3. **Copy the token** - you won't see it again!

### 5. Run Analysis

```bash
# As root user (since Docker requires it)
su -

# Go to project
cd /app/data/projects/cyberpunk-gm-screen-v2

# Set your token
export SONAR_TOKEN="your-token-here"

# Run scanner
./scripts/run-sonar-scanner-container.sh
```

## 📊 View Results

After the scan completes, view your results at:
**http://localhost:9000/projects**

## 🛠️ Available Commands

### Check Status
```bash
docker ps | grep sonarqube
```

### View Logs
```bash
docker logs sonarqube
docker logs sonarqube_db
```

### Stop SonarQube
```bash
docker compose -f docker-compose.sonarqube.yml down
```

### Restart SonarQube
```bash
docker compose -f docker-compose.sonarqube.yml restart
```

## 🔧 Configuration Files

- `sonar-project.properties` - Project settings
- `docker-compose.sonarqube.yml` - Container setup
- `scripts/run-sonar-scanner-container.sh` - Scanner script

## 📝 Next Steps

1. Complete initial setup in UI
2. Run first analysis
3. Review code quality results
4. Fix any critical issues
5. Set up quality gates
6. Configure CI/CD integration

## ⚠️ Important Notes

- SonarQube data is persisted in Docker volumes
- Database is PostgreSQL 15
- Default port is 9000
- Scanner uses container network for communication

## 🆘 Troubleshooting

If scanner fails:
1. Verify token is correct
2. Check SonarQube is running
3. Ensure you're running as root (for Docker)
4. Look at logs: `docker logs sonarqube`

---
**SonarQube is running and ready for configuration!**