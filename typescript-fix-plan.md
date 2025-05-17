# TypeScript Error Remediation Plan

## Overview
We have approximately 134 TypeScript errors across the codebase. This plan provides an efficient strategy to fix them systematically.

## Error Categories (by frequency)

### 1. Event Handler Type Issues (34 errors)
- `Property 'target' does not exist on type 'string'` (22 instances)
- `Property 'target' does not exist on type 'string | string[]'` (12 instances)

**Fix Strategy**: Update all form components to use proper onChange signatures

### 2. Icon Name Issues (31 errors)
- Various invalid icon names need mapping to valid ones

**Fix Strategy**: Global search/replace with correct mappings

### 3. Button/Component Props (27 errors)
- Size property: "small" -> "sm", "large" -> "lg" (14 instances)
- Variant property: "ghost" -> "tertiary" (10 instances)
- Children prop missing (20 instances)

**Fix Strategy**: Batch search/replace for sizes and variants

### 4. Type Definition Issues (15 errors)
- Missing properties on interfaces (hp, handle, background)
- Wrong property names (e.g., hitPoints vs hp)

**Fix Strategy**: Update type definitions to match usage

### 5. Test-Related Errors (23 errors)
- Missing test globals (it, expect, describe)
- Need proper test setup

**Fix Strategy**: Configure test environment properly

## Execution Plan

### Step 1: Quick Global Fixes (30 minutes)
```bash
# Fix button sizes
grep -r '"small"' src/ --include="*.tsx" --include="*.ts" | grep -i button
# Replace with "sm"

grep -r '"large"' src/ --include="*.tsx" --include="*.ts" | grep -i icon
# Replace with "lg"

# Fix button variants
grep -r '"ghost"' src/ --include="*.tsx" --include="*.ts"
# Replace with "tertiary"
```

### Step 2: Icon Name Mapping (45 minutes)
Create a script to map all icon names:
```typescript
const iconMapping = {
  'plus': 'add',
  'x': 'close',
  'times': 'close',
  'trash': 'remove',
  'refresh': 'redo',
  'magic': 'star',
  'user': 'player',
  'clock': 'settings',
  'pause': 'chevron-up',
  'play': 'chevron-right',
  'stop': 'close',
  'pencil': 'edit',
  'book-open': 'help'
};
```

### Step 3: Event Handler Updates (1 hour)
Fix all onChange handlers to match component signatures:
```typescript
// From: onChange={(e) => setValue(e.target.value)}
// To: onChange={(value) => setValue(value)}
```

### Step 4: Type Definition Updates (45 minutes)
Update interfaces to match actual usage:
- Character interface: hp vs hitPoints
- Add missing properties
- Fix property types

### Step 5: Test Environment Setup (30 minutes)
Configure proper test environment to resolve test-related errors

## Prioritization

1. **Critical**: Characters page errors (blocking functionality)
2. **High**: Event handler errors (causing runtime issues)
3. **Medium**: Icon/styling errors (visual issues)
4. **Low**: Test errors (not affecting production)

## Tools & Commands

### Useful grep patterns:
```bash
# Find all icon usage
grep -r 'name="[^"]*"' src/ --include="*.tsx" | grep -i icon

# Find all onChange handlers
grep -r 'onChange={' src/ --include="*.tsx"

# Find all button variants
grep -r 'variant="[^"]*"' src/ --include="*.tsx" | grep -i button
```

### Batch replacement strategy:
1. Use VS Code's search/replace with regex
2. Use sed for command-line replacements
3. Verify changes with TypeScript compiler

## Success Metrics
- All components compile without TypeScript errors
- No runtime errors in production build
- All pages load successfully
- Tests can be re-enabled in CI/CD