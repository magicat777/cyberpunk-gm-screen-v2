## Summary
Initiative Tracker and Encounter Builder in the GM Tools section do not persist state when the user navigates away or refreshes the page. All data is lost, which is problematic during game sessions.

## Current Behavior
- Initiative Tracker loses all participants and round/turn progress on page refresh
- Encounter Builder loses all configured encounters and participants when navigating away
- No option to save or restore state

## Expected Behavior
- State should persist using localStorage or similar mechanism
- Components should restore previous state on page load
- Optional: Provide manual save/load buttons

## Acceptance Criteria
- [ ] Initiative Tracker state persists across page refreshes
- [ ] Encounter Builder state persists across navigation
- [ ] State is restored when returning to these components
- [ ] Clear state option is available

## Technical Implementation
- Use Zustand persist middleware
- Store state in localStorage
- Handle state migration for future updates
- Add clear/reset functionality

## Priority
High - This affects core GM functionality during active game sessions

## Labels
bug, enhancement, gm-tools