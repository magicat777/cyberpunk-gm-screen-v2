## Summary
The Characters page is displaying a blank/black screen and throwing a TypeError in the console. The error indicates that the Select component is trying to reduce over an undefined value.

## Current Behavior
- Navigating to /characters results in blank/black page
- Console shows TypeError: Cannot read properties of undefined (reading 'reduce')
- Error originates from Select.tsx:37:34
- Page is completely non-functional

## Error Details
```
TypeError: Cannot read properties of undefined (reading 'reduce')
    at W (Select.tsx:37:34)
    at Do (react-dom.production.min.js:160:137)
    at yc (react-dom.production.min.js:289:337)
    at hc (react-dom.production.min.js:279:389)
    at Yd (react-dom.production.min.js:279:320)
    at al (react-dom.production.min.js:279:180)
    at Zi (react-dom.production.min.js:270:88)
    at fc (react-dom.production.min.js:267:429)
    at k (scheduler.production.min.js:13:203)
    at MessagePort.hn (scheduler.production.min.js:14:128)
```

## Root Cause Analysis
The error suggests that the Select component is receiving undefined options and trying to call reduce on them. This likely occurs when:
- Options prop is not passed to Select component
- Options prop is explicitly undefined
- State initialization is incorrect

## Steps to Reproduce
1. Navigate to https://magicat777.github.io/cyberpunk-gm-screen-v2/
2. Click on "Characters" in navigation
3. Observe blank page and console error

## Expected Behavior
- Characters page should load properly
- Select components should handle undefined options gracefully
- Page should display character list or creation interface

## Acceptance Criteria
- [ ] Characters page loads without errors
- [ ] Select components have proper default values
- [ ] Error handling prevents blank page on component errors
- [ ] All Select components receive required options prop

## Technical Fix
1. Check Select component implementation for undefined handling
2. Add default empty array for options: `options={options || []}`
3. Review all Select component usage in Characters page
4. Add proper error boundaries to prevent full page crashes
5. Ensure proper state initialization

## Priority
Critical - Page is completely broken and unusable

## Labels
bug, critical, characters-page, select-component