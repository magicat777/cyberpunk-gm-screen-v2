# InitiativeTracker Component

A comprehensive combat initiative tracking system for Cyberpunk Red tabletop sessions.

## Features

- **Initiative Management**: Track turn order for all combat participants
- **Automatic Calculation**: Initiative = REF + 1d10 roll
- **Turn Tracking**: Visual indicators for current turn
- **Round Counter**: Keep track of combat rounds
- **HP Management**: Track hit points and wounded status
- **Status Conditions**: Support for combat conditions
- **Character Types**: Distinguish between PCs and NPCs
- **Color Coding**: Visual distinction for each participant

## Usage

```tsx
import { InitiativeTracker } from '@/components/gm-tools/InitiativeTracker';

<InitiativeTracker />
```

## Core Functionality

### Adding Participants
- Enter character name, REF stat, and HP
- Choose between PC or NPC
- Automatic initiative rolling

### Combat Management
- Start/End combat modes
- Next/Previous turn navigation
- Round tracking
- Roll all initiatives at once

### Status Tracking
- HP tracking with wounded indicators
- Death save thresholds
- Condition management
- Visual status indicators

## State Management

Uses Zustand combat slice:
- Combat encounters
- Participant management
- Turn order
- Combat log

## Mobile Support

- Responsive layout
- Touch-friendly controls
- Optimized for tablets
- Collapsible sections

## Accessibility

- Keyboard navigation
- ARIA labels
- Screen reader support
- High contrast indicators