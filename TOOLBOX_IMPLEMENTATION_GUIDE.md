# Toolbox Implementation Guide

## Quick Start Guide

### Step 1: Enable CodeQL on GitHub
1. Go to repository Settings → Security & analysis
2. Enable "Code scanning" 
3. Set up "CodeQL analysis" with default configuration

### Step 2: Configure Enhanced ESLint
```bash
# Install additional ESLint plugins
npm install --save-dev \
  eslint-plugin-security \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  @typescript-eslint/eslint-plugin
```

Create/update `.eslintrc.json`:
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:security/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### Step 3: Setup Semgrep
Add to `.github/workflows/code-quality.yml` (already done)

### Step 4: Docker-based SonarQube Setup
```yaml
# docker-compose.sonarqube.yml
version: "3"
services:
  sonarqube:
    image: sonarqube:community
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
```

Run locally:
```bash
docker-compose -f docker-compose.sonarqube.yml up -d
```

### Step 5: Configure SonarQube Scanner
Create `sonar-project.properties`:
```properties
sonar.projectKey=cyberpunk-gm-screen-v2
sonar.projectName=Cyberpunk GM Screen v2
sonar.projectVersion=1.0
sonar.sources=src
sonar.exclusions=**/*.test.tsx,**/*.test.ts,**/coverage/**
sonar.tests=src
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts
sonar.typescript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.jacoco.xmlReportPaths=coverage/coverage.xml
```

## Integration Workflow

### Local Development
```bash
# Run all quality checks locally
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test             # Jest tests
npm run coverage     # Test coverage

# Run Semgrep locally
docker run --rm -v "${PWD}:/src" returntocorp/semgrep \
  --config=auto --config=p/security-audit
```

### CI/CD Pipeline Stages

1. **Fast Checks** (on every commit)
   - ESLint
   - TypeScript compilation
   - Unit tests
   - Semgrep security scan

2. **Deep Analysis** (on PR/merge)
   - CodeQL security analysis
   - SonarQube quality scan
   - Full test suite with coverage

3. **Nightly Scans**
   - Dependency vulnerability check
   - License compliance
   - Performance benchmarks

## Tool-Specific Configurations

### ESLint Custom Rules
Create `.eslintrc.local.js` for project-specific rules:
```javascript
module.exports = {
  rules: {
    // Cyberpunk GM Screen specific rules
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/jsx-no-target-blank': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase']
      }
    ]
  }
};
```

### Semgrep Custom Rules
Create `.semgrep.yml`:
```yaml
rules:
  - id: no-direct-dom-manipulation
    patterns:
      - pattern: document.getElementById(...)
      - pattern: document.querySelector(...)
    message: Use React refs instead of direct DOM manipulation
    languages: [typescript, tsx]
    severity: WARNING

  - id: no-hardcoded-api-keys
    pattern: |
      const API_KEY = "..."
    message: Do not hardcode API keys
    languages: [typescript, javascript]
    severity: ERROR
```

## Monitoring and Reporting

### Quality Gates
Configure in SonarQube:
- Code coverage > 80%
- No critical security issues
- Technical debt ratio < 5%
- Maintainability rating A or B

### Automated Reports
Add to CI/CD:
```yaml
- name: Generate Quality Report
  run: |
    echo "## Code Quality Report" > quality-report.md
    echo "- ESLint Issues: $(npm run lint --silent | grep -c problem)" >> quality-report.md
    echo "- TypeScript Errors: $(npm run type-check --silent | grep -c error)" >> quality-report.md
    echo "- Test Coverage: $(npm run coverage --silent | grep -oP '\d+%' | head -1)" >> quality-report.md
```

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   # Fix npm permissions for claudeuser
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   ```

2. **Docker Socket Access**
   ```bash
   # Add claudeuser to docker group
   sudo usermod -aG docker claudeuser
   ```

3. **GitHub Actions Failures**
   - Check GITHUB_TOKEN permissions
   - Verify workflow syntax
   - Review action versions

## Maintenance Schedule

### Daily
- Review CI/CD pipeline status
- Check for security alerts

### Weekly
- Update dependencies
- Review code quality metrics
- Adjust quality gates

### Monthly
- Evaluate tool effectiveness
- Update custom rules
- Performance optimization

## Success Metrics

Track these KPIs:
1. Build success rate > 95%
2. Average PR review time < 2 hours
3. Security vulnerabilities: 0 critical, < 5 high
4. Code coverage trend: increasing
5. Technical debt: decreasing

## Next Steps

1. Implement basic workflow
2. Gather team feedback
3. Fine-tune configurations
4. Expand to include:
   - Dependency scanning
   - Performance testing
   - Accessibility testing
   - Visual regression testing