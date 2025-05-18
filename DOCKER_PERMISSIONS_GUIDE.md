# Docker Permissions Guide for claudeuser

## Current Status
The `claudeuser` is not currently in the docker group, which means you'll need to either:
1. Add claudeuser to the docker group (requires root/admin)
2. Use sudo for Docker commands
3. Run Docker in rootless mode

## Option 1: Add to Docker Group (Recommended)

### What Admin Needs to Do:
```bash
# Add claudeuser to docker group
sudo usermod -aG docker claudeuser

# Verify the change
groups claudeuser
```

### After Admin Makes Change:
```bash
# Log out and log back in, or run:
newgrp docker

# Test Docker access
docker ps
```

## Option 2: Use Sudo

If you can't get added to the docker group, modify the scripts:

```bash
# Instead of:
docker compose -f docker-compose.sonarqube.yml up -d

# Use:
sudo docker compose -f docker-compose.sonarqube.yml up -d
```

## Option 3: Docker Rootless Mode

Install Docker in rootless mode (user-specific):
```bash
# Install rootless Docker
curl -fsSL https://get.docker.com/rootless | sh

# Add to PATH
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

## Checking Current Permissions

```bash
# Check if in docker group
groups

# Check Docker socket permissions
ls -la /var/run/docker.sock

# Test Docker access
docker version
```

## Modified Scripts for Sudo

If using sudo, update the scripts:

### setup-sonarqube.sh
```bash
# Replace docker commands with:
sudo docker compose -f docker-compose.sonarqube.yml up -d
```

### run-sonar-scanner.sh
```bash
# Replace docker run with:
sudo docker run \
  --rm \
  --network="host" \
  -e SONAR_HOST_URL="http://localhost:9000" \
  -e SONAR_LOGIN="$SONAR_TOKEN" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli
```

## Security Considerations

1. **Docker Group = Root Access**: Being in the docker group effectively grants root access
2. **Sudo**: Requires password but is more controlled
3. **Rootless**: Most secure but may have limitations

## Troubleshooting

### Permission Denied Error
```
Got permission denied while trying to connect to the Docker daemon socket
```
**Solution**: Add to docker group or use sudo

### Docker Command Not Found
```
docker: command not found
```
**Solution**: Install Docker or add to PATH

### Cannot Connect to Docker Daemon
```
Cannot connect to the Docker daemon. Is the docker daemon running?
```
**Solution**: Start Docker service
```bash
sudo systemctl start docker
```

## Request for Admin

To run SonarQube without sudo, request:
```
Please add claudeuser to the docker group:
sudo usermod -aG docker claudeuser
```