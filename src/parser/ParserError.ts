/**
 * Parser error types and error handling
 */

/**
 * Types of parser errors
 */
export enum ParserErrorType {
  INVALID_FORMAT = 'INVALID_FORMAT',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  UNSUPPORTED_VERSION = 'UNSUPPORTED_VERSION',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  TYPE_CONVERSION_ERROR = 'TYPE_CONVERSION_ERROR',
  UNKNOWN_OPERATOR = 'UNKNOWN_OPERATOR',
  INVALID_GRAPH_STRUCTURE = 'INVALID_GRAPH_STRUCTURE',
}

/**
 * Custom error class for parser-related errors
 */
export class ParserError extends Error {
  public readonly type: ParserErrorType;
  public readonly details: Record<string, unknown> | undefined;

  constructor(
    type: ParserErrorType,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ParserError';
    this.type = type;
    this.details = details;

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if ('captureStackTrace' in Error && typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, ParserError);
    }
  }

  /**
   * Create a formatted error message with details
   */
  public getDetailedMessage(): string {
    let message = `[${this.type}] ${this.message}`;
    
    if (this.details && Object.keys(this.details).length > 0) {
      const detailsStr = Object.entries(this.details)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(', ');
      message += ` (Details: ${detailsStr})`;
    }
    
    return message;
  }

  /**
   * Convert error to JSON for serialization
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      details: this.details,
      stack: this.stack,
    };
  }
}

/**
 * Factory functions for common parser errors
 */
export class ParserErrorFactory {
  static invalidFormat(message: string, details?: Record<string, unknown>): ParserError {
    return new ParserError(ParserErrorType.INVALID_FORMAT, message, details);
  }

  static corruptedData(message: string, details?: Record<string, unknown>): ParserError {
    return new ParserError(ParserErrorType.CORRUPTED_DATA, message, details);
  }

  static unsupportedVersion(version: string, supportedVersions: string[]): ParserError {
    return new ParserError(
      ParserErrorType.UNSUPPORTED_VERSION,
      `Unsupported version: ${version}`,
      { version, supportedVersions }
    );
  }

  static missingRequiredField(fieldName: string, context?: string): ParserError {
    return new ParserError(
      ParserErrorType.MISSING_REQUIRED_FIELD,
      `Missing required field: ${fieldName}`,
      { fieldName, context }
    );
  }

  static typeConversionError(
    sourceType: string,
    targetType: string,
    value: unknown
  ): ParserError {
    return new ParserError(
      ParserErrorType.TYPE_CONVERSION_ERROR,
      `Cannot convert from ${sourceType} to ${targetType}`,
      { sourceType, targetType, value }
    );
  }

  static unknownOperator(operatorType: string, domain?: string): ParserError {
    return new ParserError(
      ParserErrorType.UNKNOWN_OPERATOR,
      `Unknown operator: ${operatorType}`,
      { operatorType, domain }
    );
  }

  static invalidGraphStructure(message: string, details?: Record<string, unknown>): ParserError {
    return new ParserError(
      ParserErrorType.INVALID_GRAPH_STRUCTURE,
      message,
      details
    );
  }
} 