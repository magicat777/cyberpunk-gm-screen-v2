#!/bin/bash

# Phase 1: Quick Global Fixes

echo "Starting Phase 1: Quick Global Fixes"

# Fix button/icon sizes
echo "Fixing size=\"small\" -> size=\"sm\""
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/size="small"/size="sm"/g'

echo "Fixing size=\"large\" -> size=\"lg\""
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/size="large"/size="lg"/g'

# Fix button variants
echo "Fixing variant=\"ghost\" -> variant=\"tertiary\""
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/variant="ghost"/variant="tertiary"/g'

# Fix common icon names
echo "Fixing icon names..."
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="plus"/name="add"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="x"/name="close"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="times"/name="close"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="trash"/name="remove"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="refresh"/name="redo"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="pencil"/name="edit"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="user"/name="player"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="clock"/name="settings"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="pause"/name="chevron-up"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="play"/name="chevron-right"/g'
find src/ -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/name="stop"/name="close"/g'

echo "Phase 1 complete. Running type check to see remaining errors..."
npm run type-check 2>&1 | grep -c "error TS"