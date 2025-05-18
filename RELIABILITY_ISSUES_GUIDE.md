# Reliability Issues Analysis Guide

## View Reliability Issues in SonarQube

### Quick Access Links
1. **All Reliability Issues**: http://localhost:9000/project/issues?id=cyberpunk-gm-screen-v2&resolved=false&types=BUG
2. **By Severity**: http://localhost:9000/project/issues?id=cyberpunk-gm-screen-v2&resolved=false&types=BUG&severities=BLOCKER,CRITICAL,MAJOR
3. **Project Dashboard**: http://localhost:9000/dashboard?id=cyberpunk-gm-screen-v2

## Common TypeScript/React Reliability Issues

Based on typical SonarQube findings, the 19 issues likely include:

### 1. Potential Null/Undefined References
```typescript
// Problem
const value = object.property.nested; // object might be undefined

// Solution
const value = object?.property?.nested;
```

### 2. Missing Error Handling
```typescript
// Problem
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// Solution
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
```

### 3. Type Safety Issues
```typescript
// Problem
function process(data: any) {
  return data.value; // 'any' type bypasses safety
}

// Solution
interface Data {
  value: string;
}
function process(data: Data) {
  return data.value;
}
```

### 4. React Hook Dependencies
```typescript
// Problem
useEffect(() => {
  doSomething(prop);
}, []); // Missing dependency

// Solution
useEffect(() => {
  doSomething(prop);
}, [prop]);
```

## How to Fix

### Step 1: Review Issues in UI
1. Open http://localhost:9000
2. Navigate to your project
3. Click on "Reliability" or the bug count
4. Sort by severity (Critical → Major → Minor)

### Step 2: Create Fix Script
Save this PowerShell script to fix common issues:

```powershell
# fix-reliability.ps1
cd C:\claude-ubuntu-dckr4\instance4\projects\cyberpunk-gm-screen-v2

# Backup first
git add -A
git commit -m "Backup before reliability fixes"

# Fix missing optional chaining
Get-ChildItem -Path src -Recurse -Filter "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Add your sed/replace commands here
    Set-Content -Path $_.FullName -Value $content
}

# Run linter with fix
npm run lint:fix
```

### Step 3: Manual Review Required
Some issues need manual review:
- Business logic errors
- Incorrect type assertions
- Missing error boundaries
- Race conditions

## Quick Fixes by Category

### Null/Undefined Checks
```powershell
# Find potential null reference issues
docker run --rm -v "${PWD}:/src" node:latest sh -c "cd /src && grep -r '\.[a-zA-Z]\+\.[a-zA-Z]\+' src/ | grep -v '?.' | head -20"
```

### Missing Try-Catch
```powershell
# Find async functions without try-catch
docker run --rm -v "${PWD}:/src" node:latest sh -c "cd /src && grep -r 'async.*function\|async.*=>' src/ | grep -v 'try' | head -20"
```

### React Hook Issues
```powershell
# Find useEffect with empty deps
docker run --rm -v "${PWD}:/src" node:latest sh -c "cd /src && grep -r 'useEffect.*\[\]' src/ | head -20"
```

## Export Issues for Review

### Get detailed issue list:
1. In SonarQube, go to Issues page
2. Filter for Bugs only
3. Export as CSV or use API:

```powershell
# Get issues via API (if enabled)
$token = "sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566"
$project = "cyberpunk-gm-screen-v2"
Invoke-RestMethod -Uri "http://localhost:9000/api/issues/search?componentKeys=$project&types=BUG" -Headers @{Authorization="Bearer $token"}
```

## Priority Order

Fix in this order:
1. **Critical**: Crashes, data loss
2. **Major**: Functional bugs
3. **Minor**: Edge cases

## Verify Fixes

After fixing:
```powershell
# Re-run analysis
docker run --rm --network="cyberpunk-gm-screen-v2_sonarnet" -v "${PWD}:/usr/src" -e SONAR_HOST_URL="http://sonarqube:9000" -e SONAR_TOKEN="sqp_4e4f5fff65a5c6c7a2f8b270283baf3cae7cf566" sonarsource/sonar-scanner-cli -D"sonar.projectBaseDir=/usr/src" -D"sonar.projectKey=cyberpunk-gm-screen-v2" -D"sonar.sources=src"
```

---
Start by viewing the issues in the SonarQube UI to see exactly what needs fixing!