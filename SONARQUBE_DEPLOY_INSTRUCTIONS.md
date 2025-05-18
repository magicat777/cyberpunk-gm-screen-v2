# SonarQube Deployment Instructions

## Given Container Constraints

Since this is a minimal Docker container without sudo:

### Option 1: Deploy as Root

```bash
# 1. Switch to root
su -
# (enter root password when prompted)

# 2. Navigate to project
cd /app/data/projects/cyberpunk-gm-screen-v2

# 3. Start SonarQube
docker compose -f docker-compose.sonarqube.yml up -d

# 4. Check status
docker compose -f docker-compose.sonarqube.yml ps

# 5. Exit root
exit
```

### Option 2: Run on Host System

Since you're already in a container, it's often better to run SonarQube on your host system:

1. Copy the docker-compose files to your host
2. Run directly on the host
3. Access from both host and container

### Option 3: Alternative Deployment

Use a hosted SonarQube instance:
- SonarCloud (free for public repos)
- Self-hosted on a separate server
- Cloud provider solution

## Simple Test

To verify Docker access:
```bash
# As claudeuser (will likely fail)
docker ps

# As root (should work)
su -c "docker ps"
```

## What's Provided

All the necessary files are ready:
- `docker-compose.sonarqube.yml` - Full setup
- `docker-compose.sonarqube-simple.yml` - Simple setup
- `sonar-project.properties` - Configuration
- Scripts in `scripts/` directory

Just need proper Docker access to run them.