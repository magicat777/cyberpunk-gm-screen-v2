# Icon Component

A comprehensive icon system for the Cyberpunk GM Screen application, featuring both generic UI icons and Cyberpunk-specific game icons.

## Features

- **100+ Icons**: Extensive library including dice, weapons, UI controls, and Cyberpunk-themed icons
- **Scalable**: Four size presets (sm, md, lg, xl) 
- **Customizable**: Color, className, and inline styles support
- **Accessible**: ARIA labels and semantic markup
- **Interactive**: Click handlers with visual feedback
- **Theme-aware**: Adapts to dark and high-contrast themes
- **Performance**: Optimized SVG paths with minimal overhead

## Usage

```tsx
import { Icon } from '@/components/utility/Icon';

// Basic usage
<Icon name="dice-d20" />

// With size and color
<Icon name="heart" size="lg" color="red" />

// Interactive icon
<Icon 
  name="settings" 
  onClick={handleSettingsClick}
  title="Open settings"
/>

// Custom styling
<Icon 
  name="cyberware" 
  className="cyber-icon" 
  size="xl"
/>

// Accessibility
<Icon 
  name="warning" 
  aria-label="Warning: High danger level"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | IconName | required | Icon to display |
| size | IconSize | 'md' | Icon size (sm, md, lg, xl) |
| color | string | 'currentColor' | Icon color |
| className | string | - | Additional CSS classes |
| title | string | - | Tooltip text |
| aria-label | string | - | Accessibility label |
| role | string | 'img' | ARIA role |
| onClick | function | - | Click handler |

## Available Icons

### Dice Icons
- `dice-d4`, `dice-d6`, `dice-d8`, `dice-d10`, `dice-d12`, `dice-d20`

### UI Icons
- Navigation: `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right`
- Actions: `add`, `remove`, `edit`, `copy`, `paste`, `save`, `load`
- Controls: `menu`, `close`, `settings`, `search`, `filter`, `sort`
- States: `info`, `warning`, `error`, `success`, `help`

### Cyberpunk Icons
- Equipment: `cyberware`, `gun`, `armor`, `vehicle`, `chip`
- Roles: `solo`, `netrunner`, `fixer`, `cop`, `medtech`, `media`
- Factions: `corpo`, `nomad`, `streetkid`
- Status: `health`, `humanity`, `initiative`
- Damage Types: `fire`, `ice`, `electric`, `poison`, `radiation`

### Game Icons
- Combat: `sword`, `shield`, `crosshair`, `combat`
- Skills: `stealth`, `hacking`, `social`, `tech`
- Attributes: `reflex`, `endurance`, `intelligence`, `skill`

## Accessibility

- All icons include appropriate ARIA labels
- Semantic HTML with proper roles
- Keyboard accessible when interactive
- High contrast mode support
- Screen reader friendly

## Performance

- Icons are defined as static SVG paths
- No external dependencies or network requests
- Minimal runtime overhead
- Efficient re-rendering