import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundaryState, AppError, ErrorCode, ErrorLevel } from '../../../types/errors';
import { ErrorFactory } from '../../../utils/errorFactory';
import { errorHandler } from '../../../utils/errorHandler';
import { Button } from '../Form/Button';
import { Icon } from '../Icon';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  isolate?: boolean;
  showDetails?: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;
  private previousResetKeys: Array<string | number> = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const appError = ErrorFactory.create(
      ErrorCode.RENDER_ERROR,
      error.message,
      {
        level: ErrorLevel.ERROR,
        stack: error.stack,
        metadata: {
          component: 'ErrorBoundary',
          timestamp: Date.now()
        }
      }
    );

    return {
      hasError: true,
      error: appError
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = this.state.error || ErrorFactory.create(
      ErrorCode.COMPONENT_LOAD_FAILED,
      error.message,
      {
        level: ErrorLevel.ERROR,
        stack: error.stack,
        details: errorInfo.componentStack,
        metadata: {
          component: 'ErrorBoundary',
          componentStack: errorInfo.componentStack
        }
      }
    );

    // Log to global error handler
    errorHandler.handleError(appError);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(appError, errorInfo);
    }

    // Auto-reset after delay for non-critical errors
    if (appError.recoverable && appError.level !== ErrorLevel.CRITICAL) {
      this.scheduleReset(5000);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props;
    
    if (resetKeys && this.state.hasError) {
      let hasResetKeyChanged = false;
      
      for (let i = 0; i < resetKeys.length; i++) {
        if (resetKeys[i] !== this.previousResetKeys[i]) {
          hasResetKeyChanged = true;
          break;
        }
      }

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }

    this.previousResetKeys = resetKeys || [];
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }

    this.setState({
      hasError: false,
      error: null
    });
  };

  scheduleReset = (delay: number) => {
    this.resetTimeoutId = setTimeout(() => {
      this.resetErrorBoundary();
    }, delay);
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, isolate, showDetails } = this.props;

    if (hasError && error) {
      if (fallback) {
        return <>{fallback}</>;
      }

      const isRecoverable = error.recoverable && error.level !== ErrorLevel.CRITICAL;

      return (
        <div className={styles.errorBoundary} data-isolate={isolate}>
          <div className={styles.errorContent}>
            <Icon 
              name={error.level === ErrorLevel.CRITICAL ? 'alert-circle' : 'alert-triangle'} 
              size="xl" 
              className={styles.errorIcon}
            />
            
            <h2 className={styles.errorTitle}>
              {error.level === ErrorLevel.CRITICAL ? 'Critical Error' : 'Something went wrong'}
            </h2>
            
            <p className={styles.errorMessage}>{error.message}</p>
            
            {showDetails && error.details && (
              <div className={styles.errorDetails}>
                <p>{error.details}</p>
              </div>
            )}

            {showDetails && error.stack && (
              <details className={styles.stackTrace}>
                <summary>Stack Trace</summary>
                <pre>{error.stack}</pre>
              </details>
            )}

            {isRecoverable && (
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  onClick={this.resetErrorBoundary}
                  icon={<Icon name="redo" />}
                >
                  Try Again
                </Button>
                
                <Button
                  variant="tertiary"
                  onClick={() => window.location.reload()}
                  icon={<Icon name="load" />}
                >
                  Reload Page
                </Button>
              </div>
            )}

            {!isRecoverable && (
              <div className={styles.criticalError}>
                <p>This error cannot be recovered automatically.</p>
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                  icon={<Icon name="load" />}
                >
                  Reload Page
                </Button>
              </div>
            )}

            <div className={styles.errorCode}>
              Error Code: {error.code}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}