# PATH Setup Guide for Python Tools

## Issue
When installing Python tools like Semgrep with `pip install --user`, they are installed to `~/.local/bin` which is not on the PATH by default. This causes warnings during installation and the tools won't be available in the terminal.

## Solution

### Option 1: Permanent Fix (Recommended)
Add the following line to your `~/.bashrc` file:
```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then reload your shell configuration:
```bash
source ~/.bashrc
```

### Option 2: Temporary Fix
For the current terminal session only:
```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Option 3: Use the Setup Script
Run the provided setup script:
```bash
./setup-tools-path.sh
```

## Verification
After setting up the PATH, verify the tools are available:
```bash
which semgrep
semgrep --version
```

## Installed Tools
The following Python tools have been installed to `~/.local/bin`:
- `semgrep` - Security and code quality scanner
- `pygmentize` - Syntax highlighter (dependency)
- `markdown-it` - Markdown processor (dependency)
- `glom` - Data handling utility (dependency)
- `jsonschema` - JSON schema validator (dependency)
- `opentelemetry-bootstrap` - Telemetry tools (dependency)
- `opentelemetry-instrument` - Telemetry tools (dependency)

## Troubleshooting

### Permission Issues
If you get permission errors, ensure the directory exists and has correct permissions:
```bash
mkdir -p ~/.local/bin
chmod 755 ~/.local/bin
```

### PATH Not Updating
If the PATH doesn't update after modifying `.bashrc`:
1. Close and reopen your terminal
2. Or run: `exec bash`
3. Or manually source: `source ~/.bashrc`

### Tool Not Found
If a tool is still not found:
1. Check it's actually installed: `ls -la ~/.local/bin/`
2. Verify PATH is set: `echo $PATH`
3. Try full path: `~/.local/bin/semgrep --version`