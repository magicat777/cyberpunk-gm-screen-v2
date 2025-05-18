import { AppError, ErrorCode, ErrorLevel, ErrorHandler, ErrorRecoveryStrategy } from '../types/errors';
import { ErrorFactory } from './errorFactory';

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private handlers: Map<ErrorLevel, ErrorHandler[]> = new Map();
  private recoveryStrategies: Map<ErrorCode, ErrorRecoveryStrategy> = new Map();
  private errorHistory: AppError[] = [];
  private maxHistorySize = 100;

  private constructor() {
    this.setupDefaultHandlers();
    this.setupRecoveryStrategies();
    this.setupGlobalListeners();
  }

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  // Error registration
  handleError(error: AppError | Error | unknown): void {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else if (error instanceof Error) {
      appError = ErrorFactory.create(
        ErrorCode.UNKNOWN_ERROR,
        error.message,
        {
          stack: error.stack,
          metadata: { timestamp: Date.now(), context: { originalError: error.name } }
        }
      );
    } else {
      appError = ErrorFactory.create(
        ErrorCode.UNKNOWN_ERROR,
        'An unknown error occurred',
        {
          metadata: { timestamp: Date.now(), context: { originalError: String(error) } }
        }
      );
    }

    this.addToHistory(appError);
    this.executeHandlers(appError);
    this.attemptRecovery(appError);
  }

  // Handler management
  registerHandler(level: ErrorLevel, handler: ErrorHandler): void {
    if (!this.handlers.has(level)) {
      this.handlers.set(level, []);
    }
    this.handlers.get(level)!.push(handler);
  }

  removeHandler(level: ErrorLevel, handler: ErrorHandler): void {
    const handlers = this.handlers.get(level);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Recovery strategies
  registerRecoveryStrategy(strategy: ErrorRecoveryStrategy): void {
    this.recoveryStrategies.set(strategy.code, strategy);
  }

  // Error history
  getErrorHistory(limit?: number): AppError[] {
    if (limit) {
      return this.errorHistory.slice(-limit);
    }
    return [...this.errorHistory];
  }

  clearHistory(): void {
    this.errorHistory = [];
  }

  // Private methods
  private setupDefaultHandlers(): void {
    // Console logging
    this.registerHandler(ErrorLevel.INFO, (error) => {
      console.info(`[${error.code}] ${error.message}`, error);
    });

    this.registerHandler(ErrorLevel.WARNING, (error) => {
      console.warn(`[${error.code}] ${error.message}`, error);
    });

    this.registerHandler(ErrorLevel.ERROR, (error) => {
      console.error(`[${error.code}] ${error.message}`, error);
    });

    this.registerHandler(ErrorLevel.CRITICAL, (error) => {
      console.error(`[CRITICAL ${error.code}] ${error.message}`, error);
      // Could also send to external error tracking service
    });
  }

  private setupRecoveryStrategies(): void {
    // Network error recovery
    this.registerRecoveryStrategy({
      code: ErrorCode.NETWORK_ERROR,
      handler: async () => {
        // Implement retry logic
        const maxRetries = 3;
        const retryDelay = 1000;
        
        for (let i = 0; i < maxRetries; i++) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
          // Attempt to retry the network request
          // Return true if successful
        }
        return false;
      },
      retryAttempts: 3,
      retryDelay: 1000
    });

    // Storage error recovery
    this.registerRecoveryStrategy({
      code: ErrorCode.STORAGE_FULL,
      handler: async () => {
        // Attempt to clear old data
        try {
          await this.clearOldData();
          return true;
        } catch {
          return false;
        }
      }
    });
  }

  private setupGlobalListeners(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError(event.error);
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(new Error(event.reason));
    });
  }

  private isAppError(error: unknown): error is AppError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      'level' in error &&
      'message' in error
    );
  }

  private addToHistory(error: AppError): void {
    this.errorHistory.push(error);
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }
  }

  private executeHandlers(error: AppError): void {
    const handlers = this.handlers.get(error.level) || [];
    handlers.forEach(handler => {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });
  }

  private async attemptRecovery(error: AppError): Promise<void> {
    if (!error.recoverable) return;

    const strategy = this.recoveryStrategies.get(error.code);
    if (!strategy) return;

    try {
      const recovered = await strategy.handler(error);
      if (recovered) {
        console.info(`Successfully recovered from error ${error.code}`);
      } else {
        console.warn(`Failed to recover from error ${error.code}`);
      }
    } catch (recoveryError) {
      console.error('Error during recovery attempt:', recoveryError);
    }
  }

  private async clearOldData(): Promise<void> {
    // Implementation for clearing old data from storage
    const storage = window.localStorage;
    const keys = Object.keys(storage);
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    keys.forEach(key => {
      try {
        const item = storage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          if (data.timestamp && data.timestamp < oneWeekAgo) {
            storage.removeItem(key);
          }
        }
      } catch {
        // Skip invalid items
      }
    });
  }
}

// Singleton instance
export const errorHandler = GlobalErrorHandler.getInstance();