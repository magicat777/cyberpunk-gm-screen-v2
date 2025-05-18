#!/bin/bash
# Setup PATH for locally installed Python tools

# Add local bin to PATH if not already present
if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
    export PATH="$HOME/.local/bin:$PATH"
    echo "Added $HOME/.local/bin to PATH"
fi

# Verify tools are available
echo "Checking tool availability:"
for tool in semgrep pygmentize markdown-it glom jsonschema; do
    if command -v $tool &> /dev/null; then
        echo "✓ $tool is available"
    else
        echo "✗ $tool is NOT found"
    fi
done

echo ""
echo "To make this permanent, add the following to your ~/.bashrc:"
echo 'export PATH="$HOME/.local/bin:$PATH"'