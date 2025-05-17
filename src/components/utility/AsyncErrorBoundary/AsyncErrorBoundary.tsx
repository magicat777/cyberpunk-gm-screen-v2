import { Component, ReactNode } from 'react';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { AppError } from '../../../types/errors';
import { errorHandler } from '../../../utils/errorHandler';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError) => void;
}

interface AsyncErrorBoundaryState {
  hasError: boolean;
}

export class AsyncErrorBoundary extends Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  private promiseRejectionHandler: ((event: PromiseRejectionEvent) => void) | null = null;

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    // Listen for unhandled promise rejections
    this.promiseRejectionHandler = (event: PromiseRejectionEvent) => {
      errorHandler.handleError(event.reason);
      
      if (this.props.onError) {
        this.props.onError(event.reason);
      }
      
      this.setState({ hasError: true });
    };

    window.addEventListener('unhandledrejection', this.promiseRejectionHandler);
  }

  componentWillUnmount() {
    if (this.promiseRejectionHandler) {
      window.removeEventListener('unhandledrejection', this.promiseRejectionHandler);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>;
    }

    return (
      <ErrorBoundary fallback={this.props.fallback} onError={this.props.onError}>
        {this.props.children}
      </ErrorBoundary>
    );
  }
}