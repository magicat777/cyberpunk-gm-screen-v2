import { AppError, ErrorLevel } from '../types/errors';

export interface ErrorLog {
  error: AppError;
  userAgent: string;
  url: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
  additionalContext?: Record<string, any>;
}

export class ErrorLogger {
  private static sessionId = crypto.randomUUID();
  private static userId?: string;
  private static endpoint?: string;
  private static isDevelopment = process.env.NODE_ENV === 'development';

  static configure(config: {
    endpoint?: string;
    userId?: string;
  }) {
    this.endpoint = config.endpoint;
    this.userId = config.userId;
  }

  static async log(error: AppError, additionalContext?: Record<string, any>): Promise<void> {
    const errorLog: ErrorLog = {
      error,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      additionalContext
    };

    // Always log to console in development
    if (this.isDevelopment) {
      this.logToConsole(errorLog);
    }

    // Send to remote endpoint if configured
    if (this.endpoint && error.level >= ErrorLevel.ERROR) {
      await this.sendToEndpoint(errorLog);
    }

    // Store locally for error history
    this.storeLocally(errorLog);
  }

  private static logToConsole(errorLog: ErrorLog): void {
    const style = this.getConsoleStyle(errorLog.error.level);
    
    console.group(`%c[${errorLog.error.level.toUpperCase()}] ${errorLog.error.message}`, style);
    console.log('Error Code:', errorLog.error.code);
    console.log('Timestamp:', new Date(errorLog.timestamp).toISOString());
    console.log('URL:', errorLog.url);
    
    if (errorLog.error.details) {
      console.log('Details:', errorLog.error.details);
    }
    
    if (errorLog.error.metadata) {
      console.log('Metadata:', errorLog.error.metadata);
    }
    
    if (errorLog.additionalContext) {
      console.log('Context:', errorLog.additionalContext);
    }
    
    if (errorLog.error.stack) {
      console.log('Stack:', errorLog.error.stack);
    }
    
    console.groupEnd();
  }

  private static getConsoleStyle(level: ErrorLevel): string {
    const styles = {
      [ErrorLevel.INFO]: 'color: #3b82f6; font-weight: bold;',
      [ErrorLevel.WARNING]: 'color: #f59e0b; font-weight: bold;',
      [ErrorLevel.ERROR]: 'color: #ef4444; font-weight: bold;',
      [ErrorLevel.CRITICAL]: 'color: #ffffff; background-color: #dc2626; padding: 2px 4px; font-weight: bold;'
    };
    
    return styles[level];
  }

  private static async sendToEndpoint(errorLog: ErrorLog): Promise<void> {
    if (!this.endpoint) return;

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog)
      });
    } catch (sendError) {
      console.error('Failed to send error to logging endpoint:', sendError);
    }
  }

  private static storeLocally(errorLog: ErrorLog): void {
    try {
      const storageKey = 'error_logs';
      const existingLogs = localStorage.getItem(storageKey);
      const logs: ErrorLog[] = existingLogs ? JSON.parse(existingLogs) : [];
      
      // Keep only last 50 errors
      if (logs.length >= 50) {
        logs.shift();
      }
      
      logs.push(errorLog);
      localStorage.setItem(storageKey, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  static getStoredErrors(): ErrorLog[] {
    try {
      const storageKey = 'error_logs';
      const existingLogs = localStorage.getItem(storageKey);
      return existingLogs ? JSON.parse(existingLogs) : [];
    } catch {
      return [];
    }
  }

  static clearStoredErrors(): void {
    try {
      localStorage.removeItem('error_logs');
    } catch (error) {
      console.error('Failed to clear stored errors:', error);
    }
  }

  static exportErrors(): string {
    const errors = this.getStoredErrors();
    return JSON.stringify(errors, null, 2);
  }

  static downloadErrorReport(): void {
    const errors = this.exportErrors();
    const blob = new Blob([errors], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}