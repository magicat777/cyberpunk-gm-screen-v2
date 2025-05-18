# Code Coverage Setup for SonarQube

## Tests Created

Created unit tests for all modified files to improve code coverage:

1. **accessibilityHelpers.test.ts**
   - Tests handleKeyboardClick function
   - Covers Enter and Space key handling
   - Tests non-keyboard event filtering

2. **DiceRoller.test.tsx**
   - Tests component rendering
   - Tests quick roll functionality
   - Tests custom roll with modifiers
   - Tests history display

3. **EncounterBuilder.test.tsx**
   - Tests component rendering
   - Tests tab navigation
   - Tests template selection
   - Tests keyboard navigation
   - Tests encounter deletion

4. **NPCGenerator.test.tsx**
   - Tests component rendering
   - Tests NPC generation
   - Tests saved NPC selection
   - Tests NPC deletion
   - Tests archetype selection

5. **SaveManager.test.tsx**
   - Tests component rendering
   - Tests dialog opening/closing
   - Tests save game functionality
   - Tests overlay click handling

## Running Coverage

### PowerShell (Windows)
```powershell
cd C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2
.\run-tests-coverage.ps1
```

### NPM Scripts
```bash
# Run tests with coverage
npm run coverage

# Clean and run coverage
npm run coverage:clean
```

### Manual Commands
```bash
# Clean coverage directory
rm -rf coverage

# Run tests with coverage
npm test -- --coverage --run
```

## Coverage Reports

After running tests, coverage reports will be generated in:
- `coverage/lcov.info` - LCOV format for SonarQube
- `coverage/index.html` - HTML report for viewing
- `coverage/cobertura-coverage.xml` - Cobertura format

## SonarQube Integration

The coverage report (`coverage/lcov.info`) will be automatically picked up by SonarQube when running analysis with:
```
-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
```

## Expected Coverage

With these tests, you should see improved coverage for:
- `src/utils/accessibilityHelpers.ts` - ~100%
- `src/components/gm-tools/DiceRoller/DiceRoller.tsx` - ~80%
- `src/components/gm-tools/EncounterBuilder/EncounterBuilder.tsx` - ~70%
- `src/components/interactive/NPCGenerator/NPCGenerator.tsx` - ~70%
- `src/components/utility/SaveManager/SaveManager.tsx` - ~80%

## Next Steps

1. Run tests with coverage on Windows using PowerShell
2. Verify coverage reports are generated
3. Run SonarQube analysis to include coverage metrics
4. Review remaining uncovered lines in SonarQube
5. Add additional tests as needed for critical paths