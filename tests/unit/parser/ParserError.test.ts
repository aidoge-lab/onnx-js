/**
 * Unit tests for ParserError and ParserErrorFactory
 */

import {
  ParserError,
  ParserErrorType,
  ParserErrorFactory,
} from '../../../src/parser/ParserError';

describe('ParserError', () => {
  describe('ParserError class', () => {
    it('should create error with type and message', () => {
      const error = new ParserError(
        ParserErrorType.INVALID_FORMAT,
        'Invalid file format'
      );

      expect(error.name).toBe('ParserError');
      expect(error.type).toBe(ParserErrorType.INVALID_FORMAT);
      expect(error.message).toBe('Invalid file format');
      expect(error.details).toBeUndefined();
    });

    it('should create error with details', () => {
      const details = { fileName: 'model.onnx', expectedFormat: 'ONNX' };
      const error = new ParserError(
        ParserErrorType.CORRUPTED_DATA,
        'File is corrupted',
        details
      );

      expect(error.type).toBe(ParserErrorType.CORRUPTED_DATA);
      expect(error.message).toBe('File is corrupted');
      expect(error.details).toEqual(details);
    });

    it('should inherit from Error', () => {
      const error = new ParserError(
        ParserErrorType.INVALID_FORMAT,
        'Test error'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ParserError);
    });

    it('should have proper stack trace', () => {
      const error = new ParserError(
        ParserErrorType.INVALID_FORMAT,
        'Test error'
      );

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe('string');
    });
  });

  describe('getDetailedMessage', () => {
    it('should return basic message without details', () => {
      const error = new ParserError(
        ParserErrorType.INVALID_FORMAT,
        'Test error'
      );

      expect(error.getDetailedMessage()).toBe('[INVALID_FORMAT] Test error');
    });

    it('should include details in message', () => {
      const details = { line: 42, column: 10 };
      const error = new ParserError(
        ParserErrorType.CORRUPTED_DATA,
        'Parsing failed',
        details
      );

      const message = error.getDetailedMessage();
      expect(message).toContain('[CORRUPTED_DATA] Parsing failed');
      expect(message).toContain('line: 42');
      expect(message).toContain('column: 10');
    });

    it('should handle empty details object', () => {
      const error = new ParserError(
        ParserErrorType.INVALID_FORMAT,
        'Test error',
        {}
      );

      expect(error.getDetailedMessage()).toBe('[INVALID_FORMAT] Test error');
    });

    it('should stringify detail values', () => {
      const details = {
        number: 42,
        boolean: true,
        object: { nested: 'value' },
        array: [1, 2, 3],
      };
      const error = new ParserError(
        ParserErrorType.TYPE_CONVERSION_ERROR,
        'Conversion failed',
        details
      );

      const message = error.getDetailedMessage();
      expect(message).toContain('number: 42');
      expect(message).toContain('boolean: true');
      expect(message).toContain('object: [object Object]');
      expect(message).toContain('array: 1,2,3');
    });
  });

  describe('toJSON', () => {
    it('should serialize error to JSON', () => {
      const details = { version: '1.0', expected: '2.0' };
      const error = new ParserError(
        ParserErrorType.UNSUPPORTED_VERSION,
        'Version not supported',
        details
      );

      const json = error.toJSON();

      expect(json.name).toBe('ParserError');
      expect(json.type).toBe(ParserErrorType.UNSUPPORTED_VERSION);
      expect(json.message).toBe('Version not supported');
      expect(json.details).toEqual(details);
      expect(json.stack).toBeDefined();
    });

    it('should handle error without details', () => {
      const error = new ParserError(
        ParserErrorType.INVALID_FORMAT,
        'Test error'
      );

      const json = error.toJSON();

      expect(json.details).toBeUndefined();
      expect(Object.keys(json)).toEqual(['name', 'type', 'message', 'details', 'stack']);
    });
  });

  describe('ParserErrorType enum', () => {
    it('should have all expected error types', () => {
      const expectedTypes = [
        'INVALID_FORMAT',
        'CORRUPTED_DATA',
        'UNSUPPORTED_VERSION',
        'MISSING_REQUIRED_FIELD',
        'TYPE_CONVERSION_ERROR',
        'UNKNOWN_OPERATOR',
        'INVALID_GRAPH_STRUCTURE',
      ];

      expectedTypes.forEach(type => {
        expect(ParserErrorType).toHaveProperty(type);
        expect(typeof ParserErrorType[type as keyof typeof ParserErrorType]).toBe('string');
      });
    });
  });
});

describe('ParserErrorFactory', () => {
  describe('invalidFormat', () => {
    it('should create INVALID_FORMAT error', () => {
      const error = ParserErrorFactory.invalidFormat('Not a valid ONNX file');

      expect(error.type).toBe(ParserErrorType.INVALID_FORMAT);
      expect(error.message).toBe('Not a valid ONNX file');
      expect(error.details).toBeUndefined();
    });

    it('should create INVALID_FORMAT error with details', () => {
      const details = { expectedMagic: 'ONNX', actualMagic: 'TEST' };
      const error = ParserErrorFactory.invalidFormat('Magic number mismatch', details);

      expect(error.type).toBe(ParserErrorType.INVALID_FORMAT);
      expect(error.details).toEqual(details);
    });
  });

  describe('corruptedData', () => {
    it('should create CORRUPTED_DATA error', () => {
      const error = ParserErrorFactory.corruptedData('Checksum mismatch');

      expect(error.type).toBe(ParserErrorType.CORRUPTED_DATA);
      expect(error.message).toBe('Checksum mismatch');
    });
  });

  describe('unsupportedVersion', () => {
    it('should create UNSUPPORTED_VERSION error with version info', () => {
      const version = '15';
      const supportedVersions = ['11', '12', '13', '14'];
      const error = ParserErrorFactory.unsupportedVersion(version, supportedVersions);

      expect(error.type).toBe(ParserErrorType.UNSUPPORTED_VERSION);
      expect(error.message).toBe('Unsupported version: 15');
      expect(error.details?.version).toBe(version);
      expect(error.details?.supportedVersions).toEqual(supportedVersions);
    });
  });

  describe('missingRequiredField', () => {
    it('should create MISSING_REQUIRED_FIELD error', () => {
      const error = ParserErrorFactory.missingRequiredField('graph', 'ModelProto');

      expect(error.type).toBe(ParserErrorType.MISSING_REQUIRED_FIELD);
      expect(error.message).toBe('Missing required field: graph');
      expect(error.details?.fieldName).toBe('graph');
      expect(error.details?.context).toBe('ModelProto');
    });

    it('should work without context', () => {
      const error = ParserErrorFactory.missingRequiredField('name');

      expect(error.type).toBe(ParserErrorType.MISSING_REQUIRED_FIELD);
      expect(error.details?.fieldName).toBe('name');
      expect(error.details?.context).toBeUndefined();
    });
  });

  describe('typeConversionError', () => {
    it('should create TYPE_CONVERSION_ERROR', () => {
      const error = ParserErrorFactory.typeConversionError('string', 'number', 'not_a_number');

      expect(error.type).toBe(ParserErrorType.TYPE_CONVERSION_ERROR);
      expect(error.message).toBe('Cannot convert from string to number');
      expect(error.details?.sourceType).toBe('string');
      expect(error.details?.targetType).toBe('number');
      expect(error.details?.value).toBe('not_a_number');
    });
  });

  describe('unknownOperator', () => {
    it('should create UNKNOWN_OPERATOR error', () => {
      const error = ParserErrorFactory.unknownOperator('CustomOp', 'custom.domain');

      expect(error.type).toBe(ParserErrorType.UNKNOWN_OPERATOR);
      expect(error.message).toBe('Unknown operator: CustomOp');
      expect(error.details?.operatorType).toBe('CustomOp');
      expect(error.details?.domain).toBe('custom.domain');
    });

    it('should work without domain', () => {
      const error = ParserErrorFactory.unknownOperator('UnknownOp');

      expect(error.type).toBe(ParserErrorType.UNKNOWN_OPERATOR);
      expect(error.details?.operatorType).toBe('UnknownOp');
      expect(error.details?.domain).toBeUndefined();
    });
  });

  describe('invalidGraphStructure', () => {
    it('should create INVALID_GRAPH_STRUCTURE error', () => {
      const details = { nodeId: 'node_1', issue: 'circular dependency' };
      const error = ParserErrorFactory.invalidGraphStructure('Graph has cycles', details);

      expect(error.type).toBe(ParserErrorType.INVALID_GRAPH_STRUCTURE);
      expect(error.message).toBe('Graph has cycles');
      expect(error.details).toEqual(details);
    });
  });
}); 