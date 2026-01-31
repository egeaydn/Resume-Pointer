/**
 * Structured Logger
 * 
 * Provides consistent logging across the application.
 * Uses console with structured JSON in production.
 * 
 * For production, consider upgrading to pino:
 *   npm install pino pino-pretty
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.level);
    const targetLevelIndex = levels.indexOf(level);
    return targetLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    
    if (process.env.NODE_ENV === 'production') {
      // JSON format for production (easy to parse by log aggregators)
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...context,
      });
    } else {
      // Human-readable format for development
      const contextStr = context ? ` ${JSON.stringify(context)}` : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, context?: LogContext) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context));
    }
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;

// Usage examples:
// logger.info('CV analyzed successfully', { score: 78, duration: 1.2 });
// logger.error('PDF extraction failed', { error: err.message, requestId });
