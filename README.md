# ONNX-JS Parser

[![CI](https://github.com/yourusername/onnx-js-parser/workflows/CI/badge.svg)](https://github.com/yourusername/onnx-js-parser/actions/workflows/ci.yml)
[![Release](https://github.com/yourusername/onnx-js-parser/workflows/Release/badge.svg)](https://github.com/yourusername/onnx-js-parser/actions/workflows/release.yml)
[![npm version](https://badge.fury.io/js/onnx-js-parser.svg)](https://badge.fury.io/js/onnx-js-parser)
[![codecov](https://codecov.io/gh/yourusername/onnx-js-parser/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/onnx-js-parser)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/onnx-js-parser.svg)](https://nodejs.org/)

A high-quality ONNX model parser built with TypeScript, featuring clean architecture design and high readability.

## Features

- 🎯 **High Readability**: Clean code structure with comprehensive comments, easy to understand and maintain
- 🔧 **Decoupled Design**: Custom data structures, not tightly coupled to ONNX format
- 🧩 **Modular**: Uses adapter pattern, supports extending to other model formats
- ✅ **Complete Testing**: Provides comprehensive unit test coverage
- 🛡️ **Type Safety**: Full utilization of TypeScript's type system
- 📦 **Multi-format Support**: Supports ES modules, CommonJS, and UMD

## Installation

```bash
npm install onnx-js-parser
```

## Quick Start

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

## Architecture Design

### Core Components

1. **Network Model**: Custom network structure representation
2. **Parser API**: Unified parsing interface
3. **ONNX Adapter**: ONNX format adapter
4. **Protobuf Layer**: Protocol Buffer parsing layer

### Data Structures

The project defines a complete set of data structures to represent neural network models:

- `NetworkModel`: Complete network model
- `ModelMetadata`: Model metadata
- `ComputationGraph`: Computation graph structure
- `OperatorNode`: Operator node
- `Tensor`: Tensor data
- `ValueInfo`: Value information

## API Documentation

### Core Interfaces

#### IModelParser

```typescript
interface IModelParser {
  parse(buffer: ArrayBuffer): Promise<NetworkModel>;
  isValidFormat(buffer: ArrayBuffer): boolean;
  getSupportedExtensions(): readonly string[];
  getName(): string;
  getVersion(): string;
}
```

#### NetworkModel

```typescript
interface NetworkModel {
  readonly metadata: ModelMetadata;
  readonly graph: ComputationGraph;
  readonly weights: WeightCollection;
}
```

### Error Handling

The project provides a complete error handling mechanism:

```typescript
import { ParserError, ParserErrorType } from 'onnx-js-parser';

try {
  const model = await parser.parse(buffer);
} catch (error) {
  if (error instanceof ParserError) {
    console.log('Error type:', error.type);
    console.log('Details:', error.getDetailedMessage());
  }
}
```

## Development

### Requirements

- Node.js >= 16
- TypeScript >= 5.0

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Build

```bash
# Build all formats
npm run build

# Development build (watch for file changes)
npm run dev
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format code
npm run format
```

## Project Structure

```
onnx-js-parser/
├── src/
│   ├── core/           # Core data types
│   ├── parser/         # Parser interface and error handling
│   ├── onnx/          # ONNX adapter implementation
│   ├── utils/         # Utility functions
│   ├── generated/     # Generated protobuf code
│   └── index.ts       # Main entry file
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   ├── fixtures/      # Test data
│   └── helpers/       # Test helper functions
├── scripts/           # Build scripts
└── docs/             # Documentation
```

## Test Coverage

The project maintains high test coverage:

- **Code Coverage**: > 90%
- **Branch Coverage**: > 85%
- **Function Coverage**: 100%

## Contributing

Contributions are welcome! Please ensure that:

1. All tests pass
2. Code follows ESLint standards
3. Add appropriate test cases
4. Update relevant documentation

## License

MIT License

## Changelog

### v1.0.0

- Initial release
- Complete data type definitions
- Parser interface design
 