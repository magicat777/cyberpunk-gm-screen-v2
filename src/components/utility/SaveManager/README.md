# SaveManager Component

A comprehensive save/load system for managing game state persistence.

## Features

- **Multiple Save Slots**: 10 manual save slots plus auto-save
- **Auto-Save**: Automatic saving every minute (configurable)
- **Import/Export**: Save files as JSON for backup/sharing
- **Save Management**: Overwrite, delete, and organize saves
- **File Size Display**: Shows size of current state and saves
- **Metadata**: Save names, descriptions, and timestamps

## Usage

```tsx
import { SaveManager } from '@/components/utility/SaveManager';

// In a toolbar or menu
<SaveManager />
```

## Functionality

### Save System
- Manual saves to numbered slots (1-10)
- Auto-save slot with automatic updates
- Custom naming and descriptions
- Overwrite protection

### Load System
- Quick load from any slot
- Auto-save recovery
- File validation
- State restoration

### Import/Export
- Export current state or saved slots
- Import from JSON files
- Version compatibility checking
- File size validation

## Data Persistence

Saves include:
- Session data
- Character information
- Combat encounters
- Dice history
- User preferences

## State Management

Uses Zustand store with custom setters:
- `setSessions()`
- `setCharacters()` 
- `setCombatEncounters()`
- `setDiceHistory()`
- `setPreferences()`

## Error Handling

- Invalid file format detection
- Corrupted save recovery
- Storage quota management
- Import validation

## Accessibility

- Keyboard navigation
- Screen reader labels
- Focus management
- Clear visual indicators