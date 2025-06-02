/**
 * ONNX Adapter - Converts ONNX protobuf format to our internal data structures
 */

import {
  NetworkModel,
  ModelMetadata,
  ComputationGraph,
  OperatorNode,
  Tensor,
  ValueInfo,
  TypeInfo,
  DataType,
  AttributeMap,
  AttributeValue,
  WeightCollection,
  OpsetImport,
} from '../core/DataTypes';
import { IModelAdapter } from '../parser/IModelAdapter';
import { ParserError, ParserErrorFactory } from '../parser/ParserError';
import { onnx } from '../generated/onnx_pb';
import { isDefined, isString, isNumber } from '../utils/TypeUtils';

/**
 * ONNX to Internal Format Adapter
 */
export class OnnxAdapter implements IModelAdapter<onnx.IModelProto, NetworkModel> {
  private static readonly SUPPORTED_VERSIONS = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '1.11', '1.12', '1.13', '1.14', '1.15'];
  private static readonly ADAPTER_NAME = 'OnnxAdapter';
  private static readonly ADAPTER_VERSION = '1.0.0';

  /**
   * Convert ONNX ModelProto to our internal NetworkModel format
   */
  public adapt(source: onnx.IModelProto): NetworkModel {
    try {
      this.validateModelProto(source);

      const metadata = this.convertMetadata(source);
      const graph = this.convertGraph(source.graph!);
      const weights = this.extractWeights([...graph.initializers]);

      return {
        metadata,
        graph,
        weights,
      };
    } catch (error) {
      if (error instanceof ParserError) {
        throw error;
      }
      throw ParserErrorFactory.invalidGraphStructure(
        'Failed to adapt ONNX model',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Validate that the ONNX ModelProto is valid
   */
  public validate(source: onnx.IModelProto): boolean {
    try {
      this.validateModelProto(source);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get adapter name
   */
  public getName(): string {
    return OnnxAdapter.ADAPTER_NAME;
  }

  /**
   * Get supported ONNX version range
   */
  public getSupportedVersion(): string {
    return `ONNX ${OnnxAdapter.SUPPORTED_VERSIONS[0]} - ${OnnxAdapter.SUPPORTED_VERSIONS[OnnxAdapter.SUPPORTED_VERSIONS.length - 1]}`;
  }

  /**
   * Validate the ONNX ModelProto structure
   */
  private validateModelProto(model: onnx.IModelProto): void {
    if (!model) {
      throw ParserErrorFactory.missingRequiredField('model', 'ModelProto');
    }

    if (!model.graph) {
      throw ParserErrorFactory.missingRequiredField('graph', 'ModelProto');
    }

    // Check IR version if available
    if (isDefined(model.irVersion)) {
      const irVersion = typeof model.irVersion === 'number' 
        ? model.irVersion 
        : (model.irVersion as any).toNumber?.() || parseInt(String(model.irVersion));
      
      if (irVersion < 3 || irVersion > 10) {
        throw ParserErrorFactory.unsupportedVersion(
          `IR Version ${irVersion}`,
          ['3', '4', '5', '6', '7', '8', '9', '10']
        );
      }
    }
  }

  /**
   * Convert ONNX ModelProto metadata to our ModelMetadata format
   */
  private convertMetadata(model: onnx.IModelProto): ModelMetadata {
    const opsetImports: OpsetImport[] = [];
    
    if (model.opsetImport) {
      for (const opset of model.opsetImport) {
        opsetImports.push({
          domain: opset.domain || '',
          version: typeof opset.version === 'number' 
            ? opset.version 
            : (opset.version as any)?.toNumber?.() || 1,
        });
      }
    }

    // Default opset if none specified
    if (opsetImports.length === 0) {
      opsetImports.push({ domain: '', version: 1 });
    }

    return {
      name: model.graph?.name || 'unnamed_model',
      version: String(model.modelVersion || '1.0'),
      ...(model.docString && { description: model.docString }),
      ...(model.domain && { domain: model.domain }),
      ...(model.docString && { docString: model.docString }),
      ...(model.producerName && { producerName: model.producerName }),
      ...(model.producerVersion && { producerVersion: model.producerVersion }),
      opsetImports,
    };
  }

  /**
   * Convert ONNX GraphProto to our ComputationGraph format
   */
  private convertGraph(graph: onnx.IGraphProto): ComputationGraph {
    const nodes = this.convertNodes(graph.node || []);
    const inputs = this.convertValueInfos(graph.input || []);
    const outputs = this.convertValueInfos(graph.output || []);
    const initializers = this.convertTensors(graph.initializer || []);
    const valueInfos = this.convertValueInfos(graph.valueInfo || []);

    return {
      nodes,
      inputs,
      outputs,
      initializers,
      valueInfos,
    };
  }

  /**
   * Convert ONNX NodeProto array to OperatorNode array
   */
  private convertNodes(nodes: onnx.INodeProto[]): OperatorNode[] {
    return nodes.map((node, index) => this.convertNode(node, index));
  }

  /**
   * Convert single ONNX NodeProto to OperatorNode
   */
  private convertNode(node: onnx.INodeProto, index: number): OperatorNode {
    if (!node.opType) {
      throw ParserErrorFactory.missingRequiredField('opType', `NodeProto[${index}]`);
    }

    const attributes = this.convertAttributes(node.attribute || []);

    return {
      id: node.name || `node_${index}`,
      opType: node.opType,
      ...(node.name && { name: node.name }),
      inputs: [...(node.input || [])],
      outputs: [...(node.output || [])],
      attributes,
      ...(node.domain && { domain: node.domain }),
    };
  }

  /**
   * Convert ONNX AttributeProto array to AttributeMap
   */
  private convertAttributes(attributes: onnx.IAttributeProto[]): AttributeMap {
    const result: AttributeMap = {};

    for (const attr of attributes) {
      if (!attr.name) continue;

      const value = this.convertAttributeValue(attr);
      if (value !== undefined) {
        result[attr.name] = value;
      }
    }

    return result;
  }

  /**
   * Convert single ONNX AttributeProto to AttributeValue
   */
  private convertAttributeValue(attr: onnx.IAttributeProto): AttributeValue | undefined {
    switch (attr.type) {
      case onnx.AttributeProto.AttributeType.FLOAT:
        return attr.f ?? undefined;
      
      case onnx.AttributeProto.AttributeType.INT:
        return typeof attr.i === 'number' ? attr.i : (attr.i as any)?.toNumber?.() || 0;
      
      case onnx.AttributeProto.AttributeType.STRING:
        return attr.s ? new TextDecoder().decode(attr.s) : '';
      
      case onnx.AttributeProto.AttributeType.TENSOR:
        return attr.t ? this.convertTensor(attr.t) : undefined;
      
      case onnx.AttributeProto.AttributeType.FLOATS:
        return attr.floats ? [...attr.floats] : [];
      
      case onnx.AttributeProto.AttributeType.INTS:
        return attr.ints ? attr.ints.map(i => typeof i === 'number' ? i : (i as any)?.toNumber?.() || 0) : [];
      
      case onnx.AttributeProto.AttributeType.STRINGS:
        return attr.strings ? attr.strings.map(s => new TextDecoder().decode(s)) : [];
      
      case onnx.AttributeProto.AttributeType.TENSORS:
        return attr.tensors ? attr.tensors.map(t => this.convertTensor(t)) : [];
      
      default:
        // For unsupported types, return undefined
        return undefined;
    }
  }

  /**
   * Convert ONNX ValueInfoProto array to ValueInfo array
   */
  private convertValueInfos(valueInfos: onnx.IValueInfoProto[]): ValueInfo[] {
    return valueInfos.map(vi => this.convertValueInfo(vi));
  }

  /**
   * Convert single ONNX ValueInfoProto to ValueInfo
   */
  private convertValueInfo(valueInfo: onnx.IValueInfoProto): ValueInfo {
    if (!valueInfo.name) {
      throw ParserErrorFactory.missingRequiredField('name', 'ValueInfoProto');
    }

    const type = this.convertTypeInfo(valueInfo.type);

    return {
      name: valueInfo.name,
      type,
      ...(valueInfo.docString && { docString: valueInfo.docString }),
    };
  }

  /**
   * Convert ONNX TypeProto to our TypeInfo format
   */
  private convertTypeInfo(typeProto?: onnx.ITypeProto | null): TypeInfo {
    if (!typeProto) {
      return { type: 'tensor', tensorType: { elemType: DataType.UNDEFINED } };
    }

    if (typeProto.tensorType) {
      const tensorType = typeProto.tensorType;
      const elemType = this.convertDataType(tensorType.elemType || 0);
      const shape = this.extractTensorShape(tensorType.shape);

      return {
        type: 'tensor',
        tensorType: { 
          elemType, 
          ...(shape && { shape }) 
        },
      };
    }

    if (typeProto.sequenceType) {
      return {
        type: 'sequence',
        sequenceType: {
          elemType: this.convertTypeInfo(typeProto.sequenceType.elemType),
        },
      };
    }

    if (typeProto.mapType) {
      return {
        type: 'map',
        mapType: {
          keyType: this.convertDataType(typeProto.mapType.keyType || 0),
          valueType: this.convertTypeInfo(typeProto.mapType.valueType),
        },
      };
    }

    if (typeProto.opaqueType) {
      return {
        type: 'opaque',
        opaqueType: {
          domain: typeProto.opaqueType.domain || '',
          name: typeProto.opaqueType.name || '',
        },
      };
    }

    // Default to tensor type
    return { type: 'tensor', tensorType: { elemType: DataType.UNDEFINED } };
  }

  /**
   * Extract shape from ONNX tensor shape
   */
  private extractTensorShape(shape?: onnx.ITypeProto['tensorType']['shape'] | null): readonly number[] | undefined {
    if (!shape || !shape.dim) {
      return undefined;
    }

    const dimensions: number[] = [];
    for (const dim of shape.dim) {
      if (isDefined(dim.dimValue)) {
        const value = typeof dim.dimValue === 'number' 
          ? dim.dimValue 
          : (dim.dimValue as any)?.toNumber?.() || -1;
        dimensions.push(value);
      } else {
        // Unknown dimension (dynamic)
        dimensions.push(-1);
      }
    }

    return dimensions;
  }

  /**
   * Convert ONNX TensorProto array to Tensor array
   */
  private convertTensors(tensors: onnx.ITensorProto[]): Tensor[] {
    return tensors.map(t => this.convertTensor(t));
  }

  /**
   * Convert single ONNX TensorProto to Tensor
   */
  private convertTensor(tensor: onnx.ITensorProto): Tensor {
    if (!tensor.name) {
      throw ParserErrorFactory.missingRequiredField('name', 'TensorProto');
    }

    const dataType = this.convertDataType(tensor.dataType || 0);
    const shape = tensor.dims ? tensor.dims.map(d => typeof d === 'number' ? d : (d as any)?.toNumber?.() || 0) : [];
    
    // Extract tensor data
    const data = this.extractTensorData(tensor, dataType);

    return {
      name: tensor.name,
      dataType,
      shape,
      data,
      ...(tensor.rawData && { rawData: new Uint8Array(tensor.rawData) }),
    };
  }

  /**
   * Extract tensor data from ONNX TensorProto
   */
  private extractTensorData(tensor: onnx.ITensorProto, dataType: DataType): ArrayBuffer {
    // If raw data is available, use it
    if (tensor.rawData && tensor.rawData.length > 0) {
      return tensor.rawData.buffer.slice(
        tensor.rawData.byteOffset,
        tensor.rawData.byteOffset + tensor.rawData.byteLength
      );
    }

    // Otherwise, extract from typed arrays
    switch (dataType) {
      case DataType.FLOAT:
        if (tensor.floatData && tensor.floatData.length > 0) {
          return new Float32Array(tensor.floatData).buffer;
        }
        break;
      
      case DataType.DOUBLE:
        if (tensor.doubleData && tensor.doubleData.length > 0) {
          return new Float64Array(tensor.doubleData).buffer;
        }
        break;
      
      case DataType.INT32:
        if (tensor.int32Data && tensor.int32Data.length > 0) {
          return new Int32Array(tensor.int32Data).buffer;
        }
        break;
      
      case DataType.INT64:
        if (tensor.int64Data && tensor.int64Data.length > 0) {
          const int64Array = tensor.int64Data.map(v => 
            typeof v === 'number' ? v : (v as any)?.toNumber?.() || 0
          );
          return new BigInt64Array(int64Array.map(v => BigInt(v))).buffer;
        }
        break;
      
      case DataType.UINT64:
        if (tensor.uint64Data && tensor.uint64Data.length > 0) {
          const uint64Array = tensor.uint64Data.map(v => 
            typeof v === 'number' ? v : (v as any)?.toNumber?.() || 0
          );
          return new BigUint64Array(uint64Array.map(v => BigInt(v))).buffer;
        }
        break;
      
      case DataType.STRING:
        if (tensor.stringData && tensor.stringData.length > 0) {
          // Concatenate all string data
          const strings = tensor.stringData.map(s => new TextDecoder().decode(s));
          const concatenated = strings.join('\0');
          return new TextEncoder().encode(concatenated).buffer;
        }
        break;
    }

    // Return empty buffer if no data found
    return new ArrayBuffer(0);
  }

  /**
   * Convert ONNX data type to our DataType enum
   */
  private convertDataType(onnxDataType: number): DataType {
    switch (onnxDataType) {
      case onnx.TensorProto.DataType.UNDEFINED:
        return DataType.UNDEFINED;
      case onnx.TensorProto.DataType.FLOAT:
        return DataType.FLOAT;
      case onnx.TensorProto.DataType.UINT8:
        return DataType.UINT8;
      case onnx.TensorProto.DataType.INT8:
        return DataType.INT8;
      case onnx.TensorProto.DataType.UINT16:
        return DataType.UINT16;
      case onnx.TensorProto.DataType.INT16:
        return DataType.INT16;
      case onnx.TensorProto.DataType.INT32:
        return DataType.INT32;
      case onnx.TensorProto.DataType.INT64:
        return DataType.INT64;
      case onnx.TensorProto.DataType.STRING:
        return DataType.STRING;
      case onnx.TensorProto.DataType.BOOL:
        return DataType.BOOL;
      case onnx.TensorProto.DataType.FLOAT16:
        return DataType.FLOAT16;
      case onnx.TensorProto.DataType.DOUBLE:
        return DataType.DOUBLE;
      case onnx.TensorProto.DataType.UINT32:
        return DataType.UINT32;
      case onnx.TensorProto.DataType.UINT64:
        return DataType.UINT64;
      case onnx.TensorProto.DataType.COMPLEX64:
        return DataType.COMPLEX64;
      case onnx.TensorProto.DataType.COMPLEX128:
        return DataType.COMPLEX128;
      case onnx.TensorProto.DataType.BFLOAT16:
        return DataType.BFLOAT16;
      default:
        return DataType.UNDEFINED;
    }
  }

  /**
   * Extract weights from initializers
   */
  private extractWeights(initializers: readonly Tensor[]): WeightCollection {
    const weights: { [name: string]: Tensor } = {};
    
    for (const tensor of initializers) {
      weights[tensor.name] = tensor;
    }
    
    return weights;
  }
} 