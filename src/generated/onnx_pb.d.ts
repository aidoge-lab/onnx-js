/**
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
