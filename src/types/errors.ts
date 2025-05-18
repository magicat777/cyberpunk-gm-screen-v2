export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ErrorCode {
  // System errors (1000-1999)
  UNKNOWN_ERROR = 1000,
  NETWORK_ERROR = 1001,
  TIMEOUT_ERROR = 1002,
  PERMISSION_DENIED = 1003,
  
  // Data errors (2000-2999)
  VALIDATION_ERROR = 2000,
  NOT_FOUND = 2001,
  DUPLICATE_ENTRY = 2002,
  DATA_INTEGRITY_ERROR = 2003,
  
  // Storage errors (3000-3999)
  STORAGE_FULL = 3000,
  STORAGE_NOT_AVAILABLE = 3001,
  CORRUPT_DATA = 3002,
  
  // Game errors (4000-4999)
  INVALID_ROLL = 4000,
  CHARACTER_NOT_FOUND = 4001,
  INVALID_ACTION = 4002,
  INSUFFICIENT_RESOURCES = 4003,
  CYBERPSYCHO = 4004,
  
  // UI errors (5000-5999)
  COMPONENT_LOAD_FAILED = 5000,
  RENDER_ERROR = 5001,
  INTERACTION_FAILED = 5002
}

export interface ErrorMetadata {
  timestamp: number;
  component?: string;
  action?: string;
  user?: string;
  context?: Record<string, any>;
  errorType?: string;
  errorValue?: string;
  componentStack?: string;
}

export interface AppError {
  id: string;
  code: ErrorCode;
  level: ErrorLevel;
  message: string;
  details?: string;
  metadata: ErrorMetadata;
  stack?: string;
  recoverable: boolean;
}

export type ErrorHandler = (error: AppError) => void | Promise<void>;

export interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

export interface ErrorRecoveryStrategy {
  code: ErrorCode;
  handler: (error: AppError) => Promise<boolean>;
  retryAttempts?: number;
  retryDelay?: number;
}