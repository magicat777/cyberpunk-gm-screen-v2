# Docker Compatibility & Installation Requirements

## Tool Installation Matrix

| Tool | Docker Compatible | Installation Method | Permission Required | Container Available |
|------|------------------|--------------------|--------------------|-------------------|
| ESLint | ✅ Yes | npm/yarn | claudeuser | Node base image |
| TypeScript | ✅ Yes | npm/yarn | claudeuser | Node base image |
| SonarQube | ✅ Yes | Docker image | root (or Docker) | Official image |
| Semgrep | ✅ Yes | pip/Docker | claudeuser | Official image |
| CodeQL | ✅ Yes | GitHub Actions | N/A | GitHub-hosted |
| Prettier | ✅ Yes | npm/yarn | claudeuser | Node base image |
| Jest | ✅ Yes | npm/yarn | claudeuser | Node base image |

## Docker Setup Examples

### Development Container
```dockerfile
# Dockerfile.dev
FROM node:20-alpine

# Install Python for Semgrep
RUN apk add --no-cache python3 py3-pip

# Create non-root user
RUN addgroup -g 1000 claudeuser && \
    adduser -u 1000 -G claudeuser -s /bin/sh -D claudeuser

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Change ownership
RUN chown -R claudeuser:claudeuser /app

# Switch to non-root user
USER claudeuser

# Install dependencies
RUN npm ci

# Install global tools
RUN npm install -g \
    eslint \
    typescript \
    prettier

# Install Semgrep
RUN pip3 install --user semgrep

# Add pip bin to PATH
ENV PATH="/home/claudeuser/.local/bin:${PATH}"

# Copy source code
COPY --chown=claudeuser:claudeuser . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]
```

### CI/CD Container
```dockerfile
# Dockerfile.ci
FROM node:20-alpine AS builder

# Install git for CodeQL
RUN apk add --no-cache git

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run lint && \
    npm run type-check && \
    npm run test && \
    npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Docker Compose for Full Stack
```yaml
# docker-compose.full.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  sonarqube:
    image: sonarqube:community
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data

  semgrep:
    image: returntocorp/semgrep
    volumes:
      - .:/src
    command: --config=auto /src

volumes:
  sonarqube_data:
```

## Installation Commands

### As claudeuser (no root required)
```bash
# Node-based tools
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier \
  jest \
  @testing-library/react

# Python-based tools
pip install --user semgrep

# Global installations (claudeuser's npm prefix)
npm install -g typescript eslint prettier
```

### Using Docker (recommended)
```bash
# Run ESLint in container
docker run --rm -v $(pwd):/work node:20-alpine \
  sh -c "cd /work && npm ci && npm run lint"

# Run Semgrep in container
docker run --rm -v $(pwd):/src returntocorp/semgrep \
  --config=auto /src

# Run SonarQube
docker run -d --name sonarqube \
  -p 9000:9000 \
  sonarqube:community
```

## GitHub Actions Integration

All tools work seamlessly in GitHub Actions:

```yaml
name: Quality Check
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    container: node:20-alpine
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Type Check
        run: npm run type-check
        
      - name: Test
        run: npm test
        
      - name: Semgrep
        uses: returntocorp/semgrep-action@v1
        
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
```

## Permission Requirements Summary

### claudeuser permissions sufficient:
- All npm/yarn packages
- Semgrep via pip
- Running Docker containers (if in docker group)

### Root permissions needed:
- Installing Docker itself
- System-wide tool installations
- Modifying system configurations

### No installation required:
- CodeQL (GitHub-hosted)
- GitHub Actions runners
- Cloud-based tools

## Troubleshooting

### Permission Denied Errors
```bash
# For npm global installs
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# For Docker access
# Ask admin to run: sudo usermod -aG docker claudeuser
# Then log out and back in
```

### Docker Build Issues
```bash
# Clean build
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Tool Conflicts
```bash
# Use specific versions
npm install eslint@8.56.0
docker pull sonarqube:10.4-community
```

## Best Practices

1. Always use specific version tags for Docker images
2. Pin tool versions in package.json
3. Use multi-stage builds for production
4. Run tools in containers for consistency
5. Cache dependencies in CI/CD
6. Use non-root users in containers
7. Document all custom configurations