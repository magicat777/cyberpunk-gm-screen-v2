# ErrorBoundary Component

React error boundary component that catches JavaScript errors in child components and displays a fallback UI.

## Features

- Catches and displays errors with customizable UI
- Automatic error recovery for non-critical errors
- Error logging to global error handler
- Support for custom fallback components
- Reset functionality with retry capability
- Error isolation for component-level boundaries
- Reset keys for automatic recovery

## Usage

```tsx
import { ErrorBoundary } from '@/components/utility/ErrorBoundary';

// Basic usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>

// With error details
<ErrorBoundary showDetails onError={(error) => console.log(error)}>
  <YourComponent />
</ErrorBoundary>

// With reset keys
<ErrorBoundary resetKeys={[userId, dataVersion]}>
  <YourComponent />
</ErrorBoundary>

// Isolated boundary
<ErrorBoundary isolate>
  <SuspiciousComponent />
</ErrorBoundary>
```

## Props

- `children`: React nodes to wrap
- `fallback`: Custom error UI component
- `onError`: Callback when error occurs
- `resetKeys`: Keys that trigger automatic reset
- `isolate`: Create component-level boundary
- `showDetails`: Show error stack trace

## Error Recovery

The component automatically attempts recovery for recoverable errors:
- Shows "Try Again" button
- Auto-resets after 5 seconds for non-critical errors
- Resets when `resetKeys` change

## Integration

Works with the global error handler to:
- Log errors to console/external services
- Apply recovery strategies
- Track error history