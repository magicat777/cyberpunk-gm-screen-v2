import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws error
const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe('ErrorBoundary', () => {
  // Suppress console errors during tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when error is thrown', () => {
    render(
      <ErrorBoundary>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Error</div>}>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('shows error details when showDetails is true', () => {
    render(
      <ErrorBoundary showDetails>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Stack Trace')).toBeInTheDocument();
  });

  it('resets error boundary when try again is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // First render without error
    rerender(
      <ErrorBoundary>
        <div>Success</div>
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Try Again'));

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn();
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('shows critical error UI for non-recoverable errors', () => {
    const criticalError = new Error('Critical error');
    
    render(
      <ErrorBoundary>
        <ThrowError error={criticalError} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('resets when resetKeys change', () => {
    const { rerender } = render(
      <ErrorBoundary resetKeys={['key1']}>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKeys={['key2']}>
        <div>Reset Content</div>
      </ErrorBoundary>
    );

    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    expect(screen.getByText('Reset Content')).toBeInTheDocument();
  });

  it('isolates error boundary when isolate prop is true', () => {
    render(
      <ErrorBoundary isolate>
        <ThrowError error={new Error('Test error')} />
      </ErrorBoundary>
    );

    const boundary = screen.getByText('Something went wrong').closest('.errorBoundary');
    expect(boundary).toHaveAttribute('data-isolate', 'true');
  });
});