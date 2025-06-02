/**
 * Array utility functions
 */

/**
 * Check if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if an array is empty
 */
export function isEmpty(array: unknown[]): boolean {
  return array.length === 0;
}

/**
 * Get the product of all elements in a number array (useful for tensor shapes)
 */
export function product(array: number[]): number {
  return array.reduce((acc, val) => acc * val, 1);
}

/**
 * Flatten a nested array to a specified depth
 */
export function flatten<T>(array: T[], depth = 1): T[] {
  return depth > 0
    ? array.reduce<T[]>((acc, val) => 
        acc.concat(Array.isArray(val) ? flatten(val as T[], depth - 1) : val), [])
    : array.slice();
}

/**
 * Create an array filled with a specific value
 */
export function fill<T>(length: number, value: T): T[] {
  return new Array(length).fill(value);
}

/**
 * Create a range of numbers
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Check if two arrays are equal (shallow comparison)
 */
export function areEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((val, index) => val === b[index]);
}

/**
 * Remove duplicates from an array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Chunk an array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
} 