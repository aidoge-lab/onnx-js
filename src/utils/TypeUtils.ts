/**
 * Type utility functions
 */

import { DataType } from '../core/DataTypes';

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a value is an object (but not null or array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Get the size in bytes for a given data type
 */
export function getDataTypeSize(dataType: DataType): number {
  switch (dataType) {
    case DataType.BOOL:
    case DataType.INT8:
    case DataType.UINT8:
      return 1;
    case DataType.INT16:
    case DataType.UINT16:
    case DataType.FLOAT16:
    case DataType.BFLOAT16:
      return 2;
    case DataType.INT32:
    case DataType.UINT32:
    case DataType.FLOAT:
      return 4;
    case DataType.INT64:
    case DataType.UINT64:
    case DataType.DOUBLE:
      return 8;
    case DataType.COMPLEX64:
      return 8; // 2 * 4 bytes
    case DataType.COMPLEX128:
      return 16; // 2 * 8 bytes
    case DataType.STRING:
      return -1; // Variable size
    case DataType.UNDEFINED:
    default:
      return 0;
  }
}

/**
 * Get the JavaScript typed array constructor for a given data type
 */
export function getTypedArrayConstructor(dataType: DataType): new (buffer: ArrayBuffer) => ArrayBufferView {
  switch (dataType) {
    case DataType.INT8:
      return Int8Array;
    case DataType.UINT8:
    case DataType.BOOL:
      return Uint8Array;
    case DataType.INT16:
      return Int16Array;
    case DataType.UINT16:
      return Uint16Array;
    case DataType.INT32:
      return Int32Array;
    case DataType.UINT32:
      return Uint32Array;
    case DataType.FLOAT:
      return Float32Array;
    case DataType.DOUBLE:
      return Float64Array;
    case DataType.INT64:
      // Note: JavaScript doesn't have native 64-bit integer arrays
      // This would need special handling
      return BigInt64Array;
    case DataType.UINT64:
      return BigUint64Array;
    default:
      return Uint8Array;
  }
}

/**
 * Convert a value to the specified type
 */
export function convertToType(value: unknown, targetType: 'string' | 'number' | 'boolean'): string | number | boolean {
  switch (targetType) {
    case 'string':
      return String(value);
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        throw new Error(`Cannot convert "${value}" to number`);
      }
      return num;
    case 'boolean':
      if (typeof value === 'boolean') {
        return value;
      }
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
      }
      if (typeof value === 'number') {
        return value !== 0;
      }
      return Boolean(value);
    default:
      throw new Error(`Unsupported target type: ${targetType}`);
  }
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
} 