# Typography Component

A versatile typography component that provides consistent text styling across the Cyberpunk GM Screen application.

## Features

- **Multiple Variants**: Supports headings (h1-h6), subtitles, body text, captions, and overlines
- **Flexible Weights**: From thin to black (100-900)
- **Text Alignment**: Left, center, right, justify, or inherit
- **Color System**: Integrated with the theme's color palette
- **Responsive**: Automatically adjusts font sizes on smaller screens
- **Accessible**: High contrast ratios and proper semantic HTML
- **Utilities**: Gutter bottom spacing and text wrapping control

## Usage

```tsx
import { Typography } from '@/components/utility/Typography';

// Basic usage
<Typography variant="h1">Cyberpunk Red</Typography>

// With custom styling
<Typography 
  variant="body1" 
  weight="bold" 
  color="primary"
  gutterBottom
>
  Welcome to Night City
</Typography>

// Custom component
<Typography 
  component="div" 
  variant="h2"
  align="center"
>
  Character Sheet
</Typography>

// With inline styles
<Typography 
  variant="caption" 
  sx={{ marginTop: '8px' }}
>
  Last updated: 2045
</Typography>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | TypographyVariant | 'body1' | Text style variant |
| weight | TypographyWeight | 'regular' | Font weight |
| align | TypographyAlign | 'inherit' | Text alignment |
| color | TypographyColor | 'inherit' | Text color |
| gutterBottom | boolean | false | Adds bottom margin |
| noWrap | boolean | false | Prevents text wrapping |
| component | string | auto | HTML element to render |
| className | string | - | Additional CSS classes |
| sx | CSSProperties | - | Inline styles |
| id | string | - | HTML id attribute |

## Variants

- `h1` through `h6`: Heading levels
- `subtitle1`, `subtitle2`: Subtitles with different sizes
- `body1`, `body2`: Body text variants
- `caption`: Small text for captions
- `overline`: Small uppercase text

## Accessibility

- Uses semantic HTML elements based on variant
- Maintains proper heading hierarchy
- High contrast ratios for all color combinations
- Responds to user's preferred font size settings

## Responsive Design

- Heading sizes scale down on mobile devices
- Maintains readability across all screen sizes
- Preserves visual hierarchy on smaller screens
