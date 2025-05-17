#!/bin/bash

# Phase 2: Fix Event Handler Types

echo "Starting Phase 2: Fix Event Handler Types"

# Create a temporary file to track changes
echo "Finding all files with onChange event handler issues..."

# Find files with e.target.value pattern
grep -r "onChange={(e)" src/ --include="*.tsx" | grep "e.target.value" | cut -d: -f1 | sort -u > files_to_fix.txt

echo "Files to fix:"
cat files_to_fix.txt

# Create a Python script to fix the onChange handlers
cat > fix_onchange.py << 'EOF'
import re
import sys

def fix_onchange(content):
    # Pattern to match onChange handlers with e.target.value
    pattern = r'onChange=\{(\(e\)|\(event\))\s*=>\s*([^}]+)\.target\.value([^}]*)\}'
    
    def replace_handler(match):
        full_match = match.group(0)
        # Extract the function body
        body = match.group(2) + '.target.value' + match.group(3)
        # Replace e.target.value with value
        new_body = body.replace('e.target.value', 'value').replace('event.target.value', 'value')
        return f'onChange={{(value) => {new_body}}}'
    
    # Apply the fix
    fixed_content = re.sub(pattern, replace_handler, content)
    
    # Also fix patterns like onChange={(e) => setX(e.target.value)}
    simple_pattern = r'onChange=\{\(e\)\s*=>\s*(\w+)\(e\.target\.value\)\}'
    fixed_content = re.sub(simple_pattern, r'onChange={(value) => \1(value)}', fixed_content)
    
    return fixed_content

if __name__ == "__main__":
    file_path = sys.argv[1]
    with open(file_path, 'r') as f:
        content = f.read()
    
    fixed_content = fix_onchange(content)
    
    if content != fixed_content:
        with open(file_path, 'w') as f:
            f.write(fixed_content)
        print(f"Fixed: {file_path}")
EOF

# Fix each file
while read -r file; do
    python3 fix_onchange.py "$file"
done < files_to_fix.txt

# Clean up
rm fix_onchange.py files_to_fix.txt

echo "Phase 2 complete. Running type check to see remaining errors..."
npm run type-check 2>&1 | grep -c "error TS"