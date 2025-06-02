/**
 * Core data types for the ONNX parser
 * These types define our internal representation, decoupled from ONNX format
 */

/**
 * Supported data types for tensors
 */
export enum DataType {
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
  BFLOAT16 = 16,
}

/**
 * Attribute value types
 */
export type AttributeValue =
  | number
  | string
  | boolean
  | number[]
  | string[]
  | boolean[]
  | Tensor
  | Tensor[];

/**
 * Map of attribute names to values
 */
export type AttributeMap = Record<string, AttributeValue>;

/**
 * Tensor data structure
 */
export interface Tensor {
  /** Tensor name/identifier */
  readonly name: string;
  /** Data type of tensor elements */
  readonly dataType: DataType;
  /** Shape dimensions */
  readonly shape: readonly number[];
  /** Raw tensor data */
  readonly data: ArrayBuffer;
  /** Optional raw data as byte array */
  readonly rawData?: Uint8Array;
}

/**
 * Type information for values
 */
export interface TypeInfo {
  /** Value type */
  readonly type: 'tensor' | 'sequence' | 'map' | 'opaque';
  /** For tensor types */
  readonly tensorType?: {
    readonly elemType: DataType;
    readonly shape?: readonly number[];
  };
  /** For sequence types */
  readonly sequenceType?: {
    readonly elemType: TypeInfo;
  };
  /** For map types */
  readonly mapType?: {
    readonly keyType: DataType;
    readonly valueType: TypeInfo;
  };
  /** For opaque types */
  readonly opaqueType?: {
    readonly domain: string;
    readonly name: string;
  };
}

/**
 * Value information (input/output/intermediate values)
 */
export interface ValueInfo {
  /** Value name */
  readonly name: string;
  /** Type information */
  readonly type: TypeInfo;
  /** Optional documentation string */
  readonly docString?: string;
}

/**
 * Operator set import information
 */
export interface OpsetImport {
  /** Domain name (empty for ONNX domain) */
  readonly domain: string;
  /** Version number */
  readonly version: number;
}

/**
 * Model metadata
 */
export interface ModelMetadata {
  /** Model name */
  readonly name: string;
  /** Model version */
  readonly version: string;
  /** Model description */
  readonly description?: string;
  /** Model author */
  readonly author?: string;
  /** Model domain */
  readonly domain?: string;
  /** Documentation string */
  readonly docString?: string;
  /** Producer name */
  readonly producerName?: string;
  /** Producer version */
  readonly producerVersion?: string;
  /** Operator set imports */
  readonly opsetImports: readonly OpsetImport[];
}

/**
 * Operator node in the computation graph
 */
export interface OperatorNode {
  /** Unique node identifier */
  readonly id: string;
  /** Operator type */
  readonly opType: string;
  /** Optional node name */
  readonly name?: string;
  /** Input value names */
  readonly inputs: readonly string[];
  /** Output value names */
  readonly outputs: readonly string[];
  /** Node attributes */
  readonly attributes: AttributeMap;
  /** Optional domain */
  readonly domain?: string;
}

/**
 * Computation graph structure
 */
export interface ComputationGraph {
  /** Graph nodes (operators) */
  readonly nodes: readonly OperatorNode[];
  /** Graph inputs */
  readonly inputs: readonly ValueInfo[];
  /** Graph outputs */
  readonly outputs: readonly ValueInfo[];
  /** Initializer tensors (weights/constants) */
  readonly initializers: readonly Tensor[];
  /** Value information for intermediate values */
  readonly valueInfos: readonly ValueInfo[];
}

/**
 * Weight collection for easy access
 */
export interface WeightCollection {
  /** All weights indexed by name */
  readonly [name: string]: Tensor;
}

/**
 * Complete network model representation
 */
export interface NetworkModel {
  /** Model metadata */
  readonly metadata: ModelMetadata;
  /** Computation graph */
  readonly graph: ComputationGraph;
  /** Weights collection */
  readonly weights: WeightCollection;
} 