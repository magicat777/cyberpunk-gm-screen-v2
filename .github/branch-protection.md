# Branch Protection Setup

This document outlines the recommended branch protection rules for the `main` branch.

## Recommended Rules

### Basic Settings
- [ ] Require a pull request before merging
- [ ] Require approvals: 1
- [ ] Dismiss stale pull request approvals when new commits are pushed
- [ ] Require review from CODEOWNERS

### Status Checks
- [ ] Require status checks to pass before merging
- [ ] Require branches to be up to date before merging

### Required Status Checks
- [ ] CI / Build
- [ ] CI / Test  
- [ ] CI / Lint
- [ ] CI / Type Check

### Conversation Resolution
- [ ] Require conversation resolution before merging

### Additional Settings
- [ ] Include administrators
- [ ] Do not allow force pushes
- [ ] Do not allow deletions

## Setup Instructions

1. Go to Settings → Branches in your GitHub repository
2. Click "Add rule" under Branch protection rules
3. Apply these settings to the `main` branch
4. Save changes

## Branch Naming Convention

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches
- `hotfix/*` - Emergency fixes
- `docs/*` - Documentation updates
- `test/*` - Test branches