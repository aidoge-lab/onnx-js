/**
 * Model parser interface
 * Defines the contract for parsing different model formats
 */

import { NetworkModel } from '../core/DataTypes';

/**
 * Interface for model parsers
 */
export interface IModelParser {
  /**
   * Parse a model from binary data
   * @param buffer The model file as binary data
   * @returns Promise that resolves to the parsed network model
   * @throws ParserError if parsing fails
   */
  parse(buffer: ArrayBuffer): Promise<NetworkModel>;

  /**
   * Check if the provided buffer contains a valid model format
   * @param buffer The binary data to validate
   * @returns true if the format is supported and valid
   */
  isValidFormat(buffer: ArrayBuffer): boolean;

  /**
   * Get the list of supported file extensions
   * @returns Array of supported file extensions (e.g., ['.onnx'])
   */
  getSupportedExtensions(): readonly string[];

  /**
   * Get the parser name/identifier
   * @returns Parser name
   */
  getName(): string;

  /**
   * Get parser version
   * @returns Parser version string
   */
  getVersion(): string;
} 