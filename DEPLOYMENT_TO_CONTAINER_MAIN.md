# Deployment to container-main Branch

## Changes Made
- Fixed all TypeScript type errors
- Updated tests for vitest compatibility
- Removed unused code and imports

## Deployment Method
This uses GitHub Actions workflow for deployment. A temporary workflow file has been added to deploy from the `container-main` branch.

## Deployment Steps
1. Push branch from local machine:
   ```bash
   cd C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2
   git push -u origin container-main
   ```

2. The deployment will automatically trigger when you push to `container-main` branch
   - The workflow file `.github/workflows/deploy-temp.yml` handles this
   - Monitor progress at: https://github.com/magicat777/cyberpunk-gm-screen-v2/actions
   - Site will be live at: https://magicat777.github.io/cyberpunk-gm-screen-v2/

## To Revert
1. Delete the temporary workflow file:
   ```bash
   git rm .github/workflows/deploy-temp.yml
   git commit -m "Remove temporary deployment workflow"
   git push origin container-main
   ```

2. The original workflow (deploy.yml) will continue to deploy from `main` branch only

## Files Added
- `.github/workflows/deploy-temp.yml` - Temporary deployment workflow for container-main branch
- `DEPLOYMENT_TO_CONTAINER_MAIN.md` - This documentation file