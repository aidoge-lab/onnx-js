# ONNX Parser Design Document

## Project Overview

This project is a TypeScript-based ONNX file parser that aims to provide high-quality, highly readable ONNX model parsing functionality. The project adopts an adapter pattern design, converting ONNX format to our custom network structure representation, achieving decoupling and flexibility.

## Core Objectives

1. **High Readability**: Clear code structure, complete documentation, easy to understand and maintain
2. **Decoupled Design**: Custom data structures, not tightly bound to ONNX format
3. **Modularity**: Adopts adapter pattern, supports extension to other model formats
4. **Complete Testing**: Provides comprehensive unit test coverage
5. **Type Safety**: Fully leverages TypeScript's type system

## Architecture Design

### Overall Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Code     │───▶│   Parser API    │───▶│  Network Model  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   ONNX Adapter  │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  ONNX Protobuf  │
                       └─────────────────┘
```

### Core Components

1. **Network Model**: Custom network structure representation
2. **Parser API**: Unified parsing interface
3. **ONNX Adapter**: ONNX format adapter
4. **Protobuf Layer**: Protocol Buffer parsing layer

## Data Structure Design

### 1. Network Model

```typescript
interface NetworkModel {
  metadata: ModelMetadata;
  graph: ComputationGraph;
  weights: WeightCollection;
}
```

### 2. Model Metadata

```typescript
interface ModelMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  domain?: string;
  docString?: string;
  producerName?: string;
  producerVersion?: string;
  opsetImports: OpsetImport[];
}
```

### 3. Computation Graph

```typescript
interface ComputationGraph {
  nodes: OperatorNode[];
  inputs: ValueInfo[];
  outputs: ValueInfo[];
  initializers: Tensor[];
  valueInfos: ValueInfo[];
}
```

### 4. Operator Node

```typescript
interface OperatorNode {
  id: string;
  opType: string;
  name?: string;
  inputs: string[];
  outputs: string[];
  attributes: AttributeMap;
  domain?: string;
}
```

### 5. Tensor

```typescript
interface Tensor {
  name: string;
  dataType: DataType;
  shape: number[];
  data: ArrayBuffer;
  rawData?: Uint8Array;
}
```

### 6. Value Info

```typescript
interface ValueInfo {
  name: string;
  type: TypeInfo;
  docString?: string;
}
```

## Module Design

### 1. Core Module

**Path**: `src/core/`

- `NetworkModel.ts`: Network model definitions
- `DataTypes.ts`: Basic data type definitions
- `Enums.ts`: Enumeration type definitions

### 2. Parser Module

**Path**: `src/parser/`

- `IModelParser.ts`: Parser interface definition
- `ParserFactory.ts`: Parser factory
- `ParserError.ts`: Parser error definitions

### 3. ONNX Module

**Path**: `src/onnx/`

- `OnnxAdapter.ts`: ONNX adapter implementation
- `OnnxParser.ts`: ONNX parser
- `ProtobufLoader.ts`: Protobuf loader
- `TypeConverter.ts`: Type converter

### 4. Utils Module

**Path**: `src/utils/`

- `ArrayUtils.ts`: Array utility functions
- `TypeUtils.ts`: Type utility functions
- `ValidationUtils.ts`: Validation utility functions

### 5. Generated Module

**Path**: `src/generated/`

- `onnx_pb.js`: JS code generated from ONNX protobuf
- `onnx_pb.d.ts`: Corresponding TypeScript type definitions

## Interface Design

### 1. Main Parser Interface

```typescript
interface IModelParser {
  /**
   * Parse model file
   * @param buffer Binary data of the model file
   * @returns Promise<NetworkModel>
   */
  parse(buffer: ArrayBuffer): Promise<NetworkModel>;
  
  /**
   * Validate model format
   * @param buffer Binary data of the model file
   * @returns boolean
   */
  isValidFormat(buffer: ArrayBuffer): boolean;
  
  /**
   * Get supported file extensions
   * @returns string[]
   */
  getSupportedExtensions(): string[];
}
```

### 2. Adapter Interface

```typescript
interface IModelAdapter<TSource, TTarget> {
  /**
   * Convert source format to target format
   * @param source Source data
   * @returns TTarget
   */
  adapt(source: TSource): TTarget;
  
  /**
   * Validate source data validity
   * @param source Source data
   * @returns boolean
   */
  validate(source: TSource): boolean;
}
```

## Error Handling Strategy

### 1. Error Type Definition

```typescript
enum ParserErrorType {
  INVALID_FORMAT = 'INVALID_FORMAT',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  UNSUPPORTED_VERSION = 'UNSUPPORTED_VERSION',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  TYPE_CONVERSION_ERROR = 'TYPE_CONVERSION_ERROR'
}
```

### 2. Error Handling Flow

1. **Input Validation**: Check file format and integrity
2. **Version Compatibility**: Verify ONNX version support
3. **Data Conversion**: Catch type conversion errors
4. **Structure Validation**: Ensure generated model structure is correct

## Testing Strategy

### 1. Unit Test Structure

```
tests/
├── unit/
│   ├── core/           # Core module tests
│   ├── parser/         # Parser tests
│   ├── onnx/          # ONNX adapter tests
│   └── utils/         # Utility function tests
├── integration/       # Integration tests
├── fixtures/          # Test data
└── helpers/           # Test helper functions
```

### 2. Test Coverage Targets

- **Code Coverage**: > 90%
- **Branch Coverage**: > 85%
- **Function Coverage**: 100%

### 3. Test Data

- Provide various ONNX model samples
- Include edge cases and exception cases
- Cover different versions of ONNX format

## Performance Considerations

### 1. Memory Management

- Use streaming parsing to reduce memory usage
- Implement efficient ArrayBuffer handling
- Provide optional lazy loading mechanism

### 2. Parsing Optimization

- Parallel processing of independent tensor data
- Cache frequently accessed metadata
- Provide progressive parsing options

## Extensibility Design

### 1. Format Support Extension

Through the adapter pattern, support for other model formats can be easily added:

- TensorFlow SavedModel
- PyTorch (.pt)
- TensorFlow Lite (.tflite)

### 2. Feature Extension

- Model optimization analysis
- Graph visualization support
- Model conversion functionality

## Build and Deployment

### 1. Build Tools

- **TypeScript**: Type-safe development
- **Webpack**: Module bundling
- **Jest**: Testing framework
- **ESLint**: Code standards
- **Prettier**: Code formatting

### 2. Release Strategy

- Support ES modules and CommonJS
- Provide UMD build for browsers
- Generate complete TypeScript definition files

## Usage Example

```typescript
import { OnnxParser } from 'onnx-js-parser';

// Parse ONNX model
const parser = new OnnxParser();
const modelBuffer = await fetch('model.onnx').then(r => r.arrayBuffer());
const networkModel = await parser.parse(modelBuffer);

// Access model information
console.log('Model name:', networkModel.metadata.name);
console.log('Operators:', networkModel.graph.nodes.map(n => n.opType));
console.log('Weights:', Object.keys(networkModel.weights));
```

## Summary

This design document provides a clear, extensible ONNX parser architecture. Through the adapter pattern and custom data structures, we achieve decoupling from the ONNX format while maintaining high readability and maintainability. A complete testing strategy ensures code quality, and modular design supports future feature extensions. 