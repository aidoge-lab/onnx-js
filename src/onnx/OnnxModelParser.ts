/**
 * ONNX Model Parser - Parses ONNX binary files using protobuf
 */

import { IModelParser } from '../parser/IModelParser';
import { NetworkModel } from '../core/DataTypes';
import { ParserError, ParserErrorFactory } from '../parser/ParserError';
import { onnx } from '../generated/onnx_pb';
import { OnnxAdapter } from './OnnxAdapter';

/**
 * ONNX Model Parser implementation
 */
export class OnnxModelParser implements IModelParser {
  private readonly adapter: OnnxAdapter;

  constructor() {
    this.adapter = new OnnxAdapter();
  }

  /**
   * Parse ONNX binary data into NetworkModel
   */
  public async parse(data: ArrayBuffer): Promise<NetworkModel> {
    try {
      // Convert ArrayBuffer to Uint8Array for protobuf parsing
      const bytes = new Uint8Array(data);
      
      // Parse the ONNX protobuf
      const modelProto = this.parseProtobuf(bytes);
      
      // Validate the parsed model
      if (!this.adapter.validate(modelProto)) {
        throw ParserErrorFactory.invalidFormat('Invalid ONNX model structure');
      }
      
      // Convert to our internal format
      const networkModel = this.adapter.adapt(modelProto);
      
      return networkModel;
    } catch (error) {
      if (error instanceof ParserError) {
        throw error;
      }
      
      // Wrap other errors
      throw ParserErrorFactory.corruptedData(
        'Failed to parse ONNX model',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Validate if data appears to be a valid ONNX file
   */
  public isValidFormat(data: ArrayBuffer): boolean {
    try {
      const bytes = new Uint8Array(data);
      const modelProto = this.parseProtobuf(bytes);
      return this.adapter.validate(modelProto);
    } catch {
      return false;
    }
  }

  /**
   * Get supported file extensions
   */
  public getSupportedExtensions(): readonly string[] {
    return ['.onnx'];
  }

  /**
   * Get parser name
   */
  public getName(): string {
    return 'ONNX Model Parser';
  }

  /**
   * Get parser version
   */
  public getVersion(): string {
    return '1.0.0';
  }

  /**
   * Parse protobuf bytes into ONNX ModelProto
   */
  private parseProtobuf(bytes: Uint8Array): onnx.IModelProto {
    try {
      // Use the generated protobuf decoder
      const modelProto = onnx.ModelProto.decode(bytes);
      return modelProto;
    } catch (error) {
      throw ParserErrorFactory.invalidFormat(
        'Failed to parse ONNX protobuf data',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Check if the data looks like ONNX format
   */
  public static isOnnxFormat(data: ArrayBuffer): boolean {
    if (data.byteLength < 4) {
      return false;
    }

    // Check for protobuf magic number patterns
    const bytes = new Uint8Array(data);
    
    // ONNX files typically start with protobuf field tags
    // Field 1 (ir_version) would be encoded as 0x08
    // Field 7 (graph) would be encoded as 0x3A
    const firstByte = bytes[0];
    
    // Check for common protobuf field encodings
    return (
      firstByte === 0x08 ||  // ir_version field
      firstByte === 0x12 ||  // producer_name field  
      firstByte === 0x1A ||  // producer_version field
      firstByte === 0x22 ||  // domain field
      firstByte === 0x3A ||  // graph field
      firstByte === 0x42     // opset_import field
    );
  }
} 