# Remaining SonarQube Issues

## Issues Fixed
1. ✅ Nullish coalescing operators applied
2. ✅ Array index removed from keys
3. ✅ SaveManager converted to use proper `<dialog>` element

## Issues Requiring Manual Refactoring

### 1. Deeply Nested Functions (4 instances)
These require significant code restructuring to reduce function nesting:

#### EncounterBuilder.tsx
- Line 541: Extract nested click handler for keyboard event
- Line 606: Extract nested button click handler

#### NPCGenerator.tsx  
- Line 430: Extract nested keyboard event handler
- Line 452: Extract nested click handler for delete button

**Recommended approach:**
- Extract event handlers to separate functions
- Use useCallback for performance optimization
- Consider breaking complex components into smaller sub-components

### Example Refactoring Pattern:
```typescript
// Before: Deeply nested
<button
  onClick={() => setSelected(item)}
  onKeyDown={(e) => handleKeyboardClick(e, () => setSelected(item))}
>

// After: Extracted handlers
const handleItemSelect = useCallback((item) => {
  setSelected(item);
}, []);

const handleItemKeyDown = useCallback((e, item) => {
  handleKeyboardClick(e, () => handleItemSelect(item));
}, [handleItemSelect]);

<button
  onClick={() => handleItemSelect(item)}
  onKeyDown={(e) => handleItemKeyDown(e, item)}
>
```

## Next Steps
1. Run final SonarQube analysis to confirm improvements
2. Refactor deeply nested functions if required by quality gate
3. Add code coverage (currently 0%)
4. Review security hotspots

## Quality Gate Progress
- ✅ Accessibility issues: Fixed
- ✅ Reliability issues: Mostly resolved
- ⚠️ Maintainability: Some code complexity remains
- ❌ Code coverage: 0% (needs tests)
- ⚠️ Security hotspots: Need review