# SonarQube Setup Guide

## Overview
SonarQube is a code quality and security analysis platform that provides comprehensive insights into your codebase. This guide covers setting up SonarQube for the Cyberpunk GM Screen v2 project.

## Prerequisites
- Docker and Docker Compose installed
- Node.js and npm installed
- Project dependencies installed (`npm install`)

## Quick Start

### 1. Start SonarQube
```bash
./scripts/setup-sonarqube.sh
```

This will:
- Start PostgreSQL database container
- Start SonarQube container
- Wait for services to be ready
- Display access information

### 2. Access SonarQube
- URL: http://localhost:9000
- Default credentials: `admin/admin`
- You'll be prompted to change the password on first login

### 3. Run Analysis
```bash
./scripts/run-sonar-scanner.sh
```

This will:
- Generate test coverage
- Create ESLint report
- Run SonarQube scanner
- Upload results to SonarQube

## Manual Setup

### Using Docker Compose
```bash
# Start services
docker-compose -f docker-compose.sonarqube.yml up -d

# Stop services
docker-compose -f docker-compose.sonarqube.yml down

# View logs
docker-compose -f docker-compose.sonarqube.yml logs -f
```

### Running Scanner Manually
```bash
# Generate coverage
npm run test:coverage

# Generate ESLint report
npm run lint -- --format json --output-file eslint-report.json

# Run scanner
docker run \
  --rm \
  --network="host" \
  -e SONAR_HOST_URL="http://localhost:9000" \
  -e SONAR_LOGIN="admin" \
  -e SONAR_PASSWORD="admin" \
  -v "$(pwd):/usr/src" \
  sonarsource/sonar-scanner-cli
```

## Configuration

### Project Configuration
Edit `sonar-project.properties` to customize:
- Project metadata
- Source directories
- Exclusions
- Coverage paths

### Quality Gates
1. Login to SonarQube
2. Navigate to Quality Gates
3. Create custom gates for:
   - Code coverage
   - Duplications
   - Security vulnerabilities
   - Code smells

### Security
1. Change default admin password
2. Create project-specific tokens
3. Set up user permissions
4. Configure webhooks for CI/CD

## CI/CD Integration

### GitHub Actions
The workflow is already configured in `.github/workflows/sonarqube.yml`

Required secrets:
- `SONAR_TOKEN`: Authentication token from SonarQube
- `SONAR_HOST_URL`: Your SonarQube server URL

### Local Token Setup
```bash
# Set token for local scanning
export SONAR_TOKEN="your-token-here"
./scripts/run-sonar-scanner.sh
```

## Troubleshooting

### Container Issues
```bash
# Check container status
docker ps

# View logs
docker logs sonarqube
docker logs sonarqube_db

# Reset everything
docker-compose -f docker-compose.sonarqube.yml down -v
docker-compose -f docker-compose.sonarqube.yml up -d
```

### Scanner Issues
- Ensure SonarQube is running
- Check network connectivity
- Verify authentication credentials
- Review scanner logs for errors

### Memory Issues
Add to `docker-compose.sonarqube.yml`:
```yaml
services:
  sonarqube:
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
      - "SONAR_SEARCH_JAVAADDITIONALOPS=-Dnode.store.allow_mmapfs=false"
```

## Best Practices

1. **Regular Scans**
   - Run on every PR
   - Schedule nightly full scans
   - Monitor quality gates

2. **Code Coverage**
   - Maintain > 80% coverage
   - Exclude test files
   - Focus on critical paths

3. **Security**
   - Address vulnerabilities immediately
   - Review security hotspots
   - Keep dependencies updated

4. **Performance**
   - Use incremental analysis
   - Optimize exclusion patterns
   - Cache scanner data

## Maintenance

### Backup
```bash
# Backup data
docker exec sonarqube_db pg_dump -U sonar sonar > backup.sql

# Backup configurations
tar -czf sonarqube-backup.tar.gz sonarqube_data sonarqube_extensions
```

### Updates
```bash
# Update images
docker-compose -f docker-compose.sonarqube.yml pull

# Restart with new versions
docker-compose -f docker-compose.sonarqube.yml up -d
```

## Resources
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Docker Image Documentation](https://hub.docker.com/_/sonarqube)
- [Scanner Documentation](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/)