/**
 * Unit tests for ArrayUtils
 */

import {
  isArray,
  isEmpty,
  product,
  flatten,
  fill,
  range,
  areEqual,
  unique,
  chunk,
} from '../../../src/utils/ArrayUtils';

describe('ArrayUtils', () => {
  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(['a', 'b'])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray('string')).toBe(false);
      expect(isArray(123)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty arrays', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false for non-empty arrays', () => {
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty(['a'])).toBe(false);
    });
  });

  describe('product', () => {
    it('should calculate product of array elements', () => {
      expect(product([2, 3, 4])).toBe(24);
      expect(product([1, 2, 3, 4, 5])).toBe(120);
      expect(product([10])).toBe(10);
    });

    it('should return 1 for empty array', () => {
      expect(product([])).toBe(1);
    });

    it('should handle zeros', () => {
      expect(product([1, 0, 3])).toBe(0);
      expect(product([0])).toBe(0);
    });
  });

  describe('flatten', () => {
    it('should flatten array by default depth of 1', () => {
      expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
      expect(flatten([['a'], ['b', 'c']])).toEqual(['a', 'b', 'c']);
    });

    it('should flatten array by specified depth', () => {
      expect(flatten([[[1, 2]], [[3, 4]]], 2)).toEqual([1, 2, 3, 4]);
      expect(flatten([[[1, 2]], [[3, 4]]], 1)).toEqual([[1, 2], [3, 4]]);
    });

    it('should handle empty arrays', () => {
      expect(flatten([])).toEqual([]);
      expect(flatten([[], []])).toEqual([]);
    });
  });

  describe('fill', () => {
    it('should create array filled with value', () => {
      expect(fill(3, 'x')).toEqual(['x', 'x', 'x']);
      expect(fill(2, 42)).toEqual([42, 42]);
      expect(fill(1, true)).toEqual([true]);
    });

    it('should create empty array for length 0', () => {
      expect(fill(0, 'x')).toEqual([]);
    });
  });

  describe('range', () => {
    it('should create range with default step', () => {
      expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
      expect(range(1, 4)).toEqual([1, 2, 3]);
    });

    it('should create range with custom step', () => {
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
      expect(range(1, 8, 3)).toEqual([1, 4, 7]);
    });

    it('should create empty array when start >= end', () => {
      expect(range(5, 5)).toEqual([]);
      expect(range(5, 3)).toEqual([]);
    });
  });

  describe('areEqual', () => {
    it('should return true for equal arrays', () => {
      expect(areEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(areEqual(['a', 'b'], ['a', 'b'])).toBe(true);
      expect(areEqual([], [])).toBe(true);
    });

    it('should return false for different arrays', () => {
      expect(areEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      expect(areEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(areEqual(['a'], ['b'])).toBe(false);
    });

    it('should return false for arrays of different lengths', () => {
      expect(areEqual([1], [1, 2])).toBe(false);
      expect(areEqual([1, 2, 3], [1, 2])).toBe(false);
    });
  });

  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle arrays without duplicates', () => {
      expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
      expect(unique(['a'])).toEqual(['a']);
    });

    it('should handle empty arrays', () => {
      expect(unique([])).toEqual([]);
    });
  });

  describe('chunk', () => {
    it('should chunk array into specified size', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
      expect(chunk([1, 2, 3, 4, 5], 3)).toEqual([[1, 2, 3], [4, 5]]);
    });

    it('should handle arrays smaller than chunk size', () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });

    it('should handle empty arrays', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });
}); 