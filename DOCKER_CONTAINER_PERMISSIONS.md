# Docker Container Permissions Guide

## Environment Context
This project is running inside a Docker container where:
- No sudo is available
- You can switch between `claudeuser` and `root`
- Docker-in-Docker requires special container setup

## Option 1: Run as Root

Switch to root user and run the commands:
```bash
# First, become root
su -

# Then run Docker commands
cd /app/data/projects/cyberpunk-gm-screen-v2
docker compose -f docker-compose.sonarqube.yml up -d
```

## Option 2: Docker-in-Docker Setup

For claudeuser to run Docker, the container needs to be started with:
- Docker socket mounted: `-v /var/run/docker.sock:/var/run/docker.sock`
- User in docker group or running privileged

## Option 3: Run SonarQube Outside Container

Since you're already in a container, consider running SonarQube on the host system instead.

## Modified Scripts for Root Execution

### As claudeuser, create alias:
```bash
echo 'alias run-sonarqube="su -c \"cd $(pwd) && ./scripts/setup-sonarqube.sh\""' >> ~/.bashrc
source ~/.bashrc
```

### Or create a wrapper script:
Create `scripts/setup-sonarqube-as-root.sh`:
```bash
#!/bin/bash
echo "This script needs to be run as root."
echo "Please run: su -c '$0'"
exit 1
```

## Current Limitations

1. **Docker-in-Docker**: Running Docker inside Docker requires special container configuration
2. **No sudo**: This minimal container doesn't have sudo installed
3. **Permission constraints**: claudeuser can't access Docker socket without proper setup

## Recommendations

1. **For Development**: Run SonarQube on the host system, not inside this container
2. **For CI/CD**: Use separate containers for app and SonarQube
3. **For Testing**: Use root user temporarily

## Quick Commands

### Check Docker availability:
```bash
# As claudeuser
docker version 2>/dev/null || echo "Docker not available as claudeuser"

# As root
su -c "docker version"
```

### Run as root in one command:
```bash
su -c "cd /app/data/projects/cyberpunk-gm-screen-v2 && docker compose -f docker-compose.sonarqube.yml up -d"
```