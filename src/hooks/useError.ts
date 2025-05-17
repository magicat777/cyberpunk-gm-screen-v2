import { useCallback, useState } from 'react';
import { AppError, ErrorCode, ErrorLevel } from '../types/errors';
import { ErrorFactory } from '../utils/errorFactory';
import { errorHandler } from '../utils/errorHandler';
import { useNotification } from './useNotification';

interface UseErrorOptions {
  showNotification?: boolean;
  autoRecover?: boolean;
  fallbackValue?: any;
}

export function useError(options: UseErrorOptions = {}) {
  const { showNotification = true, autoRecover = true } = options;
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification: notify } = useNotification();

  const handleError = useCallback((error: Error | AppError | unknown, customMessage?: string) => {
    let appError: AppError;

    if (error instanceof Error) {
      appError = ErrorFactory.create(
        ErrorCode.UNKNOWN_ERROR,
        customMessage || error.message,
        {
          stack: error.stack,
          metadata: { originalError: error.name }
        }
      );
    } else if (typeof error === 'object' && error !== null && 'code' in error) {
      appError = error as AppError;
    } else {
      appError = ErrorFactory.create(
        ErrorCode.UNKNOWN_ERROR,
        customMessage || 'An unexpected error occurred',
        {
          metadata: { originalError: String(error) }
        }
      );
    }

    setError(appError);
    errorHandler.handleError(appError);

    if (showNotification) {
      notify({
        title: 'Error',
        message: appError.message,
        type: 'error',
        duration: 5000
      });
    }
  }, [showNotification, notify]);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  const executeWithErrorHandling = useCallback(async <T,>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (error) {
      handleError(error, errorMessage);
      
      if (options.fallbackValue !== undefined) {
        return options.fallbackValue;
      }
      
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, options.fallbackValue]);

  const throwError = useCallback((
    code: ErrorCode,
    message: string,
    level: ErrorLevel = ErrorLevel.ERROR
  ) => {
    const appError = ErrorFactory.create(code, message, { level });
    handleError(appError);
  }, [handleError]);

  return {
    error,
    isLoading,
    handleError,
    reset,
    executeWithErrorHandling,
    throwError
  };
}

// Specific error hooks for common scenarios
export function useNetworkError() {
  const { showNotification } = useNotification();

  return useCallback((url: string, statusCode?: number) => {
    const error = ErrorFactory.networkError(
      `Failed to fetch from ${url}`,
      url,
      statusCode
    );
    
    errorHandler.handleError(error);
    
    showNotification({
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your connection.',
      type: 'error',
      duration: 5000
    });
  }, [showNotification]);
}

export function useValidationError() {
  const { showNotification } = useNotification();

  return useCallback((field: string, message: string) => {
    const error = ErrorFactory.validationError(field, message);
    
    errorHandler.handleError(error);
    
    showNotification({
      title: 'Validation Error',
      message,
      type: 'warning',
      duration: 3000
    });
  }, [showNotification]);
}

export function useGameError() {
  const { showNotification } = useNotification();

  return useCallback((message: string, action: string, context?: Record<string, any>) => {
    const error = ErrorFactory.gameError(message, action, context);
    
    errorHandler.handleError(error);
    
    showNotification({
      title: 'Game Error',
      message,
      type: 'warning',
      duration: 4000
    });
  }, [showNotification]);
}