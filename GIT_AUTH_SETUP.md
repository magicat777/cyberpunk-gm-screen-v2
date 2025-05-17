# Git Authentication Setup in Container

## Option 1: Personal Access Token (Recommended)

This is the easiest method for pushing to GitHub from this container.

### Steps:

1. **Create a Personal Access Token on GitHub**:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a descriptive name (e.g., "Docker Container Access")
   - Select scopes:
     - ✓ repo (for full repository access)
     - ✓ workflow (for GitHub Actions)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Configure Git to Use the Token**:
   ```bash
   # Store credentials in memory for this session
   git config --global credential.helper cache
   
   # Or store permanently (less secure)
   git config --global credential.helper store
   ```

3. **Push Using Token**:
   ```bash
   # When prompted for username: your-github-username
   # When prompted for password: paste your personal access token
   git push origin main
   ```

## Option 2: SSH Key Setup

More secure but slightly more complex:

1. **Generate SSH Key**:
   ```bash
   ssh-keygen -t ed25519 -C "dev@cyberpunk-gm-screen.com"
   # Press Enter to accept default location
   # Enter a passphrase (optional)
   ```

2. **Add SSH Key to SSH Agent**:
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copy Public Key**:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

4. **Add Key to GitHub**:
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the public key
   - Save

5. **Change Remote to SSH**:
   ```bash
   git remote set-url origin git@github.com:magicat777/cyberpunk-gm-screen-v2.git
   ```

6. **Push**:
   ```bash
   git push origin main
   ```

## Option 3: GitHub CLI (if installed)

Install GitHub CLI and authenticate:

```bash
# Install gh (if available in your package manager)
sudo apt-get update && sudo apt-get install gh

# Authenticate
gh auth login
# Follow the prompts
```

## Option 4: Temporary Token in URL (Quick but Less Secure)

For a one-time push:

```bash
git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/magicat777/cyberpunk-gm-screen-v2.git main
```

Replace YOUR_USERNAME and YOUR_TOKEN with your GitHub username and personal access token.

## Security Notes

- Personal Access Tokens are like passwords - keep them secure
- If using credential.helper store, tokens are saved in plain text
- For production use, consider SSH keys or more secure credential managers
- Revoke tokens immediately if compromised: https://github.com/settings/tokens

## Current Configuration

Your container has:
- Git user configured: Cyberpunk GM Dev
- Git email configured: dev@cyberpunk-gm-screen.com
- VS Code credential helper configured (but may not work for direct git commands)

Pick the option that works best for your security requirements!