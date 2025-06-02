/**
 * Model adapter interface
 * Defines the contract for adapting different model formats to our internal representation
 */

/**
 * Generic adapter interface for converting between model formats
 */
export interface IModelAdapter<TSource, TTarget> {
  /**
   * Convert source format to target format
   * @param source The source data to convert
   * @returns The converted target data
   * @throws ParserError if conversion fails
   */
  adapt(source: TSource): TTarget;

  /**
   * Validate that the source data is valid for this adapter
   * @param source The source data to validate
   * @returns true if the source data is valid
   */
  validate(source: TSource): boolean;

  /**
   * Get the adapter name/identifier
   * @returns Adapter name
   */
  getName(): string;

  /**
   * Get the supported source format version
   * @returns Version string or version range
   */
  getSupportedVersion(): string;
} 