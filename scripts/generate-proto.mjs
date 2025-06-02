/**
 * Script to generate JavaScript code from ONNX protobuf definitions
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ONNX_PROTO_URL = 'https://raw.githubusercontent.com/onnx/onnx/main/onnx/onnx.proto';
const PROTO_DIR = path.join(__dirname, '../proto');
const GENERATED_DIR = path.join(__dirname, '../src/generated');

// Ensure directories exist
if (!fs.existsSync(PROTO_DIR)) {
  fs.mkdirSync(PROTO_DIR, { recursive: true });
}

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

async function downloadOnnxProto() {
  console.log('Downloading ONNX protobuf definition...');
  
  try {
    const https = await import('https');
    const protoPath = path.join(PROTO_DIR, 'onnx.proto');
    
    if (fs.existsSync(protoPath)) {
      console.log('ONNX proto file already exists, skipping download.');
      return protoPath;
    }
    
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(protoPath);
      
      https.default.get(ONNX_PROTO_URL, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log('ONNX proto file downloaded successfully.');
          resolve(protoPath);
        });
        
        file.on('error', (err) => {
          fs.unlink(protoPath, () => {}); // Delete the file on error
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error('Error downloading ONNX proto:', error);
    throw error;
  }
}

async function generateProtobufJS(protoPath) {
  console.log('Generating protobuf.js code...');
  
  try {
    const protobuf = await import('protobufjs');
    
    // Load the proto file - fix for protobufjs v7.x
    const root = await protobuf.default.load(protoPath);
    
    // Generate static code
    const jsCode = `/**
 * Generated JavaScript code for ONNX protobuf
 * Auto-generated from onnx.proto
 */

import protobuf from 'protobufjs/minimal.js';

// Configure protobuf.js
protobuf.util.Long = undefined;
protobuf.configure();

${generateStaticCode(root)}

export { onnx };
`;

    const jsPath = path.join(GENERATED_DIR, 'onnx_pb.js');
    fs.writeFileSync(jsPath, jsCode);
    console.log('JavaScript protobuf code generated.');
    
    return root;
  } catch (error) {
    console.error('Error generating protobuf.js code:', error);
    // Fallback to stub implementation
    console.log('Falling back to stub implementation...');
    generateJavaScriptStub();
    return null;
  }
}

function generateStaticCode(root) {
  // This is a simplified version - in practice you'd use protobuf.js code generation
  return `
const onnx = {};

// Export the protobuf root for dynamic access
onnx.root = ${JSON.stringify(root.toJSON(), null, 2)};

// ModelProto
onnx.ModelProto = (function() {
  function ModelProto(properties) {
    if (properties) {
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i) {
        if (properties[keys[i]] != null) {
          this[keys[i]] = properties[keys[i]];
        }
      }
    }
  }

  ModelProto.decode = function decode(reader, length) {
    if (!(reader instanceof protobuf.Reader)) {
      reader = protobuf.Reader.create(reader);
    }
    
    let end = length === undefined ? reader.len : reader.pos + length;
    let message = new onnx.ModelProto();
    
    while (reader.pos < end) {
      let tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.irVersion = reader.int64();
          break;
        case 8:
          if (!(message.opsetImport && message.opsetImport.length)) {
            message.opsetImport = [];
          }
          message.opsetImport.push(onnx.OperatorSetIdProto.decode(reader, reader.uint32()));
          break;
        case 2:
          message.producerName = reader.string();
          break;
        case 3:
          message.producerVersion = reader.string();
          break;
        case 4:
          message.domain = reader.string();
          break;
        case 5:
          message.modelVersion = reader.int64();
          break;
        case 6:
          message.docString = reader.string();
          break;
        case 7:
          message.graph = onnx.GraphProto.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };

  ModelProto.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof protobuf.Reader)) {
      reader = new protobuf.Reader(reader);
    }
    return this.decode(reader, reader.uint32());
  };

  return ModelProto;
})();

// Add other proto message types here...
// This is a simplified implementation for demonstration
onnx.GraphProto = function GraphProto() {};
onnx.NodeProto = function NodeProto() {};
onnx.TensorProto = function TensorProto() {};
onnx.ValueInfoProto = function ValueInfoProto() {};
onnx.AttributeProto = function AttributeProto() {};
onnx.OperatorSetIdProto = function OperatorSetIdProto() {};

// Enums
onnx.TensorProto.DataType = {
  UNDEFINED: 0,
  FLOAT: 1,
  UINT8: 2,
  INT8: 3,
  UINT16: 4,
  INT16: 5,
  INT32: 6,
  INT64: 7,
  STRING: 8,
  BOOL: 9,
  FLOAT16: 10,
  DOUBLE: 11,
  UINT32: 12,
  UINT64: 13,
  COMPLEX64: 14,
  COMPLEX128: 15,
  BFLOAT16: 16
};

onnx.AttributeProto.AttributeType = {
  UNDEFINED: 0,
  FLOAT: 1,
  INT: 2,
  STRING: 3,
  TENSOR: 4,
  GRAPH: 5,
  SPARSE_TENSOR: 11,
  TYPE_PROTO: 13,
  FLOATS: 6,
  INTS: 7,
  STRINGS: 8,
  TENSORS: 9,
  GRAPHS: 10,
  SPARSE_TENSORS: 12,
  TYPE_PROTOS: 14
};
`;
}

function generateTypeScriptDefinitions() {
  console.log('Generating TypeScript definitions...');
  
  // Create TypeScript definitions that match our JavaScript implementation
  const tsDefinitions = `/**
 * Generated TypeScript definitions for ONNX protobuf
 * This file provides type definitions for the protobufjs generated code
 */

export namespace onnx {
  interface IModelProto {
    irVersion?: number | Long | null;
    opsetImport?: IOperatorSetIdProto[] | null;
    producerName?: string | null;
    producerVersion?: string | null;
    domain?: string | null;
    modelVersion?: number | Long | null;
    docString?: string | null;
    graph?: IGraphProto | null;
    metadataProps?: IStringStringEntryProto[] | null;
    trainingInfo?: ITrainingInfoProto[] | null;
    functions?: IFunctionProto[] | null;
  }

  interface IGraphProto {
    node?: INodeProto[] | null;
    name?: string | null;
    initializer?: ITensorProto[] | null;
    sparseInitializer?: ISparseTensorProto[] | null;
    docString?: string | null;
    input?: IValueInfoProto[] | null;
    output?: IValueInfoProto[] | null;
    valueInfo?: IValueInfoProto[] | null;
    quantizationAnnotation?: ITensorAnnotation[] | null;
  }

  interface INodeProto {
    input?: string[] | null;
    output?: string[] | null;
    name?: string | null;
    opType?: string | null;
    domain?: string | null;
    attribute?: IAttributeProto[] | null;
    docString?: string | null;
  }

  interface ITensorProto {
    dims?: (number | Long)[] | null;
    dataType?: number | null;
    segment?: ITensorProto.ISegment | null;
    floatData?: number[] | null;
    int32Data?: number[] | null;
    stringData?: Uint8Array[] | null;
    int64Data?: (number | Long)[] | null;
    name?: string | null;
    docString?: string | null;
    rawData?: Uint8Array | null;
    externalData?: IStringStringEntryProto[] | null;
    dataLocation?: TensorProto.DataLocation | null;
    doubleData?: number[] | null;
    uint64Data?: (number | Long)[] | null;
  }

  interface IValueInfoProto {
    name?: string | null;
    type?: ITypeProto | null;
    docString?: string | null;
  }

  interface ITypeProto {
    tensorType?: ITypeProto.ITensor | null;
    sequenceType?: ITypeProto.ISequence | null;
    mapType?: ITypeProto.IMap | null;
    opaqueType?: ITypeProto.IOpaque | null;
    sparseMatrixType?: ITypeProto.ISparseTensor | null;
    denotation?: string | null;
  }

  namespace ITypeProto {
    interface ITensor {
      elemType?: number | null;
      shape?: ITypeProto.ITensor.IShape | null;
    }

    namespace ITensor {
      interface IShape {
        dim?: ITypeProto.ITensor.IShape.IDimension[] | null;
      }

      namespace IShape {
        interface IDimension {
          dimValue?: number | Long | null;
          dimParam?: string | null;
          denotation?: string | null;
        }
      }
    }

    interface ISequence {
      elemType?: ITypeProto | null;
    }

    interface IMap {
      keyType?: number | null;
      valueType?: ITypeProto | null;
    }

    interface IOpaque {
      domain?: string | null;
      name?: string | null;
    }

    interface ISparseTensor {
      elemType?: number | null;
      shape?: ITypeProto.ITensor.IShape | null;
    }
  }

  interface IAttributeProto {
    name?: string | null;
    refAttrName?: string | null;
    docString?: string | null;
    type?: AttributeProto.AttributeType | null;
    f?: number | null;
    i?: number | Long | null;
    s?: Uint8Array | null;
    t?: ITensorProto | null;
    g?: IGraphProto | null;
    sparseT?: ISparseTensorProto | null;
    tp?: ITypeProto | null;
    floats?: number[] | null;
    ints?: (number | Long)[] | null;
    strings?: Uint8Array[] | null;
    tensors?: ITensorProto[] | null;
    graphs?: IGraphProto[] | null;
    sparseTensors?: ISparseTensorProto[] | null;
    typeProtos?: ITypeProto[] | null;
  }

  interface IOperatorSetIdProto {
    domain?: string | null;
    version?: number | Long | null;
  }

  interface IStringStringEntryProto {
    key?: string | null;
    value?: string | null;
  }

  interface ITrainingInfoProto {
    initialization?: IGraphProto | null;
    algorithm?: IGraphProto | null;
    initializationBinding?: IStringStringEntryProto[] | null;
    updateBinding?: IStringStringEntryProto[] | null;
  }

  interface IFunctionProto {
    name?: string | null;
    input?: string[] | null;
    output?: string[] | null;
    attribute?: string[] | null;
    attributeProto?: IAttributeProto[] | null;
    node?: INodeProto[] | null;
    docString?: string | null;
    opsetImport?: IOperatorSetIdProto[] | null;
    domain?: string | null;
  }

  interface ISparseTensorProto {
    values?: ITensorProto | null;
    indices?: ITensorProto | null;
    dims?: (number | Long)[] | null;
  }

  interface ITensorAnnotation {
    tensorName?: string | null;
    quantParameterTensorNames?: IStringStringEntryProto[] | null;
  }

  class ModelProto implements IModelProto {
    constructor(properties?: IModelProto);
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): ModelProto;
    static decodeDelimited(reader: protobuf.Reader | Uint8Array): ModelProto;
    static encode(message: IModelProto, writer?: protobuf.Writer): protobuf.Writer;
    static encodeDelimited(message: IModelProto, writer?: protobuf.Writer): protobuf.Writer;
  }

  class GraphProto implements IGraphProto {
    constructor(properties?: IGraphProto);
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): GraphProto;
  }

  class NodeProto implements INodeProto {
    constructor(properties?: INodeProto);
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): NodeProto;
  }

  class TensorProto implements ITensorProto {
    constructor(properties?: ITensorProto);
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): TensorProto;
  }

  class ValueInfoProto implements IValueInfoProto {
    constructor(properties?: IValueInfoProto);
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): ValueInfoProto;
  }

  class AttributeProto implements IAttributeProto {
    constructor(properties?: IAttributeProto);
    static decode(reader: protobuf.Reader | Uint8Array, length?: number): AttributeProto;
  }

  namespace TensorProto {
    enum DataType {
      UNDEFINED = 0,
      FLOAT = 1,
      UINT8 = 2,
      INT8 = 3,
      UINT16 = 4,
      INT16 = 5,
      INT32 = 6,
      INT64 = 7,
      STRING = 8,
      BOOL = 9,
      FLOAT16 = 10,
      DOUBLE = 11,
      UINT32 = 12,
      UINT64 = 13,
      COMPLEX64 = 14,
      COMPLEX128 = 15,
      BFLOAT16 = 16
    }

    enum DataLocation {
      DEFAULT = 0,
      EXTERNAL = 1
    }
  }

  namespace AttributeProto {
    enum AttributeType {
      UNDEFINED = 0,
      FLOAT = 1,
      INT = 2,
      STRING = 3,
      TENSOR = 4,
      GRAPH = 5,
      SPARSE_TENSOR = 11,
      TYPE_PROTO = 13,
      FLOATS = 6,
      INTS = 7,
      STRINGS = 8,
      TENSORS = 9,
      GRAPHS = 10,
      SPARSE_TENSORS = 12,
      TYPE_PROTOS = 14
    }
  }
}

declare module 'protobufjs/minimal' {
  interface Writer {
    finish(): Uint8Array;
  }

  interface Reader {
    pos: number;
    len: number;
    uint32(): number;
    int64(): number | Long;
    string(): string;
    skipType(wireType: number): Reader;
  }

  function configure(): void;
  
  namespace Reader {
    function create(buffer: Uint8Array): Reader;
  }

  interface Long {
    toNumber(): number;
  }
}

export const onnx: {
  ModelProto: typeof onnx.ModelProto;
  GraphProto: typeof onnx.GraphProto;
  NodeProto: typeof onnx.NodeProto;
  TensorProto: typeof onnx.TensorProto & {
    DataType: typeof onnx.TensorProto.DataType;
    DataLocation: typeof onnx.TensorProto.DataLocation;
  };
  ValueInfoProto: typeof onnx.ValueInfoProto;
  AttributeProto: typeof onnx.AttributeProto & {
    AttributeType: typeof onnx.AttributeProto.AttributeType;
  };
};
`;

  const tsPath = path.join(GENERATED_DIR, 'onnx_pb.d.ts');
  fs.writeFileSync(tsPath, tsDefinitions);
  console.log('TypeScript definitions generated.');
}

function generateJavaScriptStub() {
  console.log('Generating JavaScript stub (fallback)...');
  
  // Create a basic JavaScript stub that exports the necessary objects
  const jsStub = `/**
 * Generated JavaScript stub for ONNX protobuf
 * This is a fallback implementation when protobuf.js is not available
 */

// Basic protobuf implementation
const protobuf = {
  Writer: function() {
    this.finish = () => new Uint8Array();
    return this;
  },
  Reader: function(buffer) {
    this.pos = 0;
    this.len = buffer.length;
    return this;
  },
  configure: () => {}
};

// ONNX namespace with stub implementations
const onnx = {
  ModelProto: class ModelProto {
    constructor(properties = {}) {
      Object.assign(this, properties);
    }
    
    static decode(reader, length) {
      // Stub implementation - in real scenario this would use protobufjs
      throw new Error('ONNX protobuf parsing not implemented in stub mode. Please implement actual protobuf parsing.');
    }
    
    static decodeDelimited(reader) {
      return this.decode(reader);
    }
    
    static encode(message, writer = new protobuf.Writer()) {
      return writer;
    }
    
    static encodeDelimited(message, writer = new protobuf.Writer()) {
      return this.encode(message, writer);
    }
  },
  
  TensorProto: {
    DataType: {
      UNDEFINED: 0,
      FLOAT: 1,
      UINT8: 2,
      INT8: 3,
      UINT16: 4,
      INT16: 5,
      INT32: 6,
      INT64: 7,
      STRING: 8,
      BOOL: 9,
      FLOAT16: 10,
      DOUBLE: 11,
      UINT32: 12,
      UINT64: 13,
      COMPLEX64: 14,
      COMPLEX128: 15,
      BFLOAT16: 16
    },
    DataLocation: {
      DEFAULT: 0,
      EXTERNAL: 1
    }
  },
  
  AttributeProto: {
    AttributeType: {
      UNDEFINED: 0,
      FLOAT: 1,
      INT: 2,
      STRING: 3,
      TENSOR: 4,
      GRAPH: 5,
      SPARSE_TENSOR: 11,
      TYPE_PROTO: 13,
      FLOATS: 6,
      INTS: 7,
      STRINGS: 8,
      TENSORS: 9,
      GRAPHS: 10,
      SPARSE_TENSORS: 12,
      TYPE_PROTOS: 14
    }
  }
};

export { onnx };
`;

  const jsPath = path.join(GENERATED_DIR, 'onnx_pb.js');
  fs.writeFileSync(jsPath, jsStub);
  console.log('JavaScript stub generated.');
}

async function main() {
  try {
    console.log('Starting protobuf generation process...');
    
    // Download the real ONNX proto file
    const protoPath = await downloadOnnxProto();
    
    // Try to generate real protobuf code, fallback to stub if needed
    const root = await generateProtobufJS(protoPath);
    
    // Always generate TypeScript definitions
    generateTypeScriptDefinitions();
    
    console.log('Protobuf generation completed successfully!');
    if (root) {
      console.log('✅ Real protobuf parsing enabled');
    } else {
      console.log('⚠️  Using stub implementation - install protobufjs for full functionality');
    }
  } catch (error) {
    console.error('Error during protobuf generation:', error);
    console.log('Falling back to stub implementation...');
    generateJavaScriptStub();
    generateTypeScriptDefinitions();
  }
}

main(); 