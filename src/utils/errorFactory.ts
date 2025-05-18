import { AppError, ErrorCode, ErrorLevel, ErrorMetadata } from '../types/errors';

export class ErrorFactory {
  static create(
    code: ErrorCode,
    message: string,
    options: {
      level?: ErrorLevel;
      details?: string;
      metadata?: Partial<ErrorMetadata>;
      stack?: string;
      recoverable?: boolean;
    } = {}
  ): AppError {
    const {
      level = ErrorLevel.ERROR,
      details,
      metadata = {},
      stack,
      recoverable = true
    } = options;

    return {
      id: crypto.randomUUID(),
      code,
      level,
      message,
      details,
      metadata: {
        timestamp: Date.now(),
        ...metadata
      },
      stack: stack || new Error().stack,
      recoverable
    };
  }

  // Convenience methods for common errors
  static validationError(
    field: string,
    message: string,
    details?: string
  ): AppError {
    return this.create(ErrorCode.VALIDATION_ERROR, message, {
      level: ErrorLevel.WARNING,
      details,
      metadata: { timestamp: Date.now(), context: { field } }
    });
  }

  static networkError(
    message: string,
    url?: string,
    statusCode?: number
  ): AppError {
    return this.create(ErrorCode.NETWORK_ERROR, message, {
      level: ErrorLevel.ERROR,
      metadata: { timestamp: Date.now(), context: { url, statusCode } }
    });
  }

  static notFoundError(
    resourceType: string,
    resourceId: string
  ): AppError {
    return this.create(
      ErrorCode.NOT_FOUND,
      `${resourceType} not found: ${resourceId}`,
      {
        metadata: { timestamp: Date.now(), context: { resourceType, resourceId } }
      }
    );
  }

  static gameError(
    message: string,
    action: string,
    context?: Record<string, any>
  ): AppError {
    return this.create(ErrorCode.INVALID_ACTION, message, {
      level: ErrorLevel.WARNING,
      metadata: { action, context }
    });
  }

  static storageError(
    message: string,
    operation: string
  ): AppError {
    return this.create(ErrorCode.STORAGE_NOT_AVAILABLE, message, {
      level: ErrorLevel.ERROR,
      metadata: { timestamp: Date.now(), context: { operation } },
      recoverable: false
    });
  }

  static criticalError(
    message: string,
    component?: string
  ): AppError {
    return this.create(ErrorCode.UNKNOWN_ERROR, message, {
      level: ErrorLevel.CRITICAL,
      metadata: { timestamp: Date.now(), context: { component } },
      recoverable: false
    });
  }
}