# ESLint Configuration Guide

## Overview
We've enhanced our ESLint configuration with the following plugins:
- `eslint-plugin-security` - Security-focused linting rules
- `eslint-plugin-react-hooks` - React Hooks best practices
- `eslint-plugin-jsx-a11y` - Accessibility rules for JSX
- `@typescript-eslint/eslint-plugin` - TypeScript-specific rules

## Configuration Files

### Main Configuration (eslint.config.js)
The main configuration file uses the modern flat config format and includes all plugins with their recommended rules.

### Legacy Configuration (.eslintrc.json)
Maintained for compatibility with some tools that may not support the flat config format yet.

### Enhanced Configuration (eslint.config.enhanced.js)
An advanced configuration with stricter rules and additional customizations.

## Available Scripts

```bash
# Run ESLint on all files
npm run lint

# Run ESLint and automatically fix issues
npm run lint:fix

# Run specific configuration
ESLINT_USE_FLAT_CONFIG=true npx eslint . -c eslint.config.enhanced.js
```

## Key Rules

### Security
- Detects potential security vulnerabilities
- Warns about object injection attacks
- Identifies possible timing attacks

### Accessibility
- Ensures alt text for images
- Validates ARIA properties
- Checks role attributes
- Enforces label associations

### TypeScript
- Prevents unused variables
- Disallows explicit 'any' types
- Enforces naming conventions
- Manages type assertions

### React
- Validates hook usage
- Ensures component export patterns
- Manages prop types (disabled for TypeScript)

## Customization

To adjust rules for your specific needs:

1. Edit `eslint.config.js` for project-wide rules
2. Use `.eslintignore` or the `ignores` property to exclude files
3. Override rules in specific directories using additional config blocks

## IDE Integration

### VS Code
1. Install the ESLint extension
2. Add to `.vscode/settings.json`:
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm/IntelliJ
1. Enable ESLint in Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
2. Select "Automatic ESLint configuration"

## Troubleshooting

### Common Issues

1. **Plugin not found**
   ```bash
   npm install --save-dev [plugin-name]
   ```

2. **Configuration conflicts**
   - Ensure only one configuration format is active
   - Check for duplicate rule definitions

3. **Performance issues**
   - Use `--cache` flag for faster subsequent runs
   - Exclude unnecessary directories

## Best Practices

1. Run lint before commits
2. Fix issues incrementally
3. Customize rules based on team preferences
4. Document rule exceptions
5. Keep plugins updated