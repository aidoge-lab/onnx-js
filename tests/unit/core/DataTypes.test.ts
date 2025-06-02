/**
 * Unit tests for core data types
 */

import {
  DataType,
  AttributeValue,
  AttributeMap,
  Tensor,
  TypeInfo,
  ValueInfo,
  OpsetImport,
  ModelMetadata,
  OperatorNode,
  ComputationGraph,
  WeightCollection,
  NetworkModel,
} from '../../../src/core/DataTypes';

describe('DataTypes', () => {
  describe('DataType enum', () => {
    it('should have correct values for basic data types', () => {
      expect(DataType.UNDEFINED).toBe(0);
      expect(DataType.FLOAT).toBe(1);
      expect(DataType.UINT8).toBe(2);
      expect(DataType.INT8).toBe(3);
      expect(DataType.DOUBLE).toBe(11);
      expect(DataType.BFLOAT16).toBe(16);
    });

    it('should cover all expected data types', () => {
      const expectedTypes = [
        'UNDEFINED', 'FLOAT', 'UINT8', 'INT8', 'UINT16', 'INT16',
        'INT32', 'INT64', 'STRING', 'BOOL', 'FLOAT16', 'DOUBLE',
        'UINT32', 'UINT64', 'COMPLEX64', 'COMPLEX128', 'BFLOAT16'
      ];
      
      expectedTypes.forEach(type => {
        expect(DataType).toHaveProperty(type);
      });
    });
  });

  describe('Tensor interface', () => {
    it('should accept valid tensor data', () => {
      const buffer = new ArrayBuffer(16);
      const tensor: Tensor = {
        name: 'test_tensor',
        dataType: DataType.FLOAT,
        shape: [2, 2],
        data: buffer,
      };

      expect(tensor.name).toBe('test_tensor');
      expect(tensor.dataType).toBe(DataType.FLOAT);
      expect(tensor.shape).toEqual([2, 2]);
      expect(tensor.data).toBe(buffer);
    });

    it('should support optional rawData field', () => {
      const buffer = new ArrayBuffer(16);
      const rawData = new Uint8Array(buffer);
      const tensor: Tensor = {
        name: 'test_tensor',
        dataType: DataType.UINT8,
        shape: [4, 4],
        data: buffer,
        rawData,
      };

      expect(tensor.rawData).toBe(rawData);
    });
  });

  describe('TypeInfo interface', () => {
    it('should support tensor type', () => {
      const tensorType: TypeInfo = {
        type: 'tensor',
        tensorType: {
          elemType: DataType.FLOAT,
          shape: [224, 224, 3],
        },
      };

      expect(tensorType.type).toBe('tensor');
      expect(tensorType.tensorType?.elemType).toBe(DataType.FLOAT);
      expect(tensorType.tensorType?.shape).toEqual([224, 224, 3]);
    });

    it('should support sequence type', () => {
      const sequenceType: TypeInfo = {
        type: 'sequence',
        sequenceType: {
          elemType: {
            type: 'tensor',
            tensorType: { elemType: DataType.INT32 },
          },
        },
      };

      expect(sequenceType.type).toBe('sequence');
      expect(sequenceType.sequenceType?.elemType.type).toBe('tensor');
    });

    it('should support map type', () => {
      const mapType: TypeInfo = {
        type: 'map',
        mapType: {
          keyType: DataType.STRING,
          valueType: {
            type: 'tensor',
            tensorType: { elemType: DataType.FLOAT },
          },
        },
      };

      expect(mapType.type).toBe('map');
      expect(mapType.mapType?.keyType).toBe(DataType.STRING);
    });

    it('should support opaque type', () => {
      const opaqueType: TypeInfo = {
        type: 'opaque',
        opaqueType: {
          domain: 'ai.onnx.ml',
          name: 'TreeEnsemble',
        },
      };

      expect(opaqueType.type).toBe('opaque');
      expect(opaqueType.opaqueType?.domain).toBe('ai.onnx.ml');
      expect(opaqueType.opaqueType?.name).toBe('TreeEnsemble');
    });
  });

  describe('ValueInfo interface', () => {
    it('should create valid value info', () => {
      const typeInfo: TypeInfo = {
        type: 'tensor',
        tensorType: { elemType: DataType.FLOAT },
      };

      const valueInfo: ValueInfo = {
        name: 'input',
        type: typeInfo,
        docString: 'Input tensor',
      };

      expect(valueInfo.name).toBe('input');
      expect(valueInfo.type).toBe(typeInfo);
      expect(valueInfo.docString).toBe('Input tensor');
    });
  });

  describe('OperatorNode interface', () => {
    it('should create valid operator node', () => {
      const attributes: AttributeMap = {
        alpha: 0.2,
        beta: [1.0, 2.0],
        transpose_a: false,
        axes: [0, 1],
      };

      const node: OperatorNode = {
        id: 'node_1',
        opType: 'MatMul',
        name: 'matmul_1',
        inputs: ['input_1', 'input_2'],
        outputs: ['output_1'],
        attributes,
        domain: '',
      };

      expect(node.id).toBe('node_1');
      expect(node.opType).toBe('MatMul');
      expect(node.inputs).toEqual(['input_1', 'input_2']);
      expect(node.outputs).toEqual(['output_1']);
      expect(node.attributes.alpha).toBe(0.2);
    });
  });

  describe('ModelMetadata interface', () => {
    it('should create valid model metadata', () => {
      const opsetImports: OpsetImport[] = [
        { domain: '', version: 13 },
        { domain: 'ai.onnx.ml', version: 2 },
      ];

      const metadata: ModelMetadata = {
        name: 'test_model',
        version: '1.0',
        description: 'Test model for unit tests',
        author: 'Test Suite',
        domain: 'ai.onnx',
        docString: 'Documentation string',
        producerName: 'test_producer',
        producerVersion: '1.0.0',
        opsetImports,
      };

      expect(metadata.name).toBe('test_model');
      expect(metadata.version).toBe('1.0');
      expect(metadata.opsetImports).toHaveLength(2);
      expect(metadata.opsetImports[0].version).toBe(13);
    });
  });

  describe('ComputationGraph interface', () => {
    it('should create valid computation graph', () => {
      const inputInfo: ValueInfo = {
        name: 'input',
        type: { type: 'tensor', tensorType: { elemType: DataType.FLOAT } },
      };

      const outputInfo: ValueInfo = {
        name: 'output',
        type: { type: 'tensor', tensorType: { elemType: DataType.FLOAT } },
      };

      const node: OperatorNode = {
        id: 'node_1',
        opType: 'Identity',
        inputs: ['input'],
        outputs: ['output'],
        attributes: {},
      };

      const graph: ComputationGraph = {
        nodes: [node],
        inputs: [inputInfo],
        outputs: [outputInfo],
        initializers: [],
        valueInfos: [],
      };

      expect(graph.nodes).toHaveLength(1);
      expect(graph.inputs).toHaveLength(1);
      expect(graph.outputs).toHaveLength(1);
      expect(graph.nodes[0].opType).toBe('Identity');
    });
  });

  describe('WeightCollection interface', () => {
    it('should create valid weight collection', () => {
      const weight1: Tensor = {
        name: 'weight1',
        dataType: DataType.FLOAT,
        shape: [10, 5],
        data: new ArrayBuffer(200),
      };

      const weight2: Tensor = {
        name: 'weight2',
        dataType: DataType.FLOAT,
        shape: [5, 1],
        data: new ArrayBuffer(20),
      };

      const weights: WeightCollection = {
        weight1,
        weight2,
      };

      expect(weights.weight1).toBe(weight1);
      expect(weights.weight2).toBe(weight2);
      expect(Object.keys(weights)).toHaveLength(2);
    });
  });

  describe('NetworkModel interface', () => {
    it('should create complete network model', () => {
      const metadata: ModelMetadata = {
        name: 'test_model',
        version: '1.0',
        opsetImports: [{ domain: '', version: 13 }],
      };

      const graph: ComputationGraph = {
        nodes: [],
        inputs: [],
        outputs: [],
        initializers: [],
        valueInfos: [],
      };

      const weights: WeightCollection = {};

      const model: NetworkModel = {
        metadata,
        graph,
        weights,
      };

      expect(model.metadata).toBe(metadata);
      expect(model.graph).toBe(graph);
      expect(model.weights).toBe(weights);
    });
  });

  describe('AttributeValue types', () => {
    it('should support all attribute value types', () => {
      const tensor: Tensor = {
        name: 'attr_tensor',
        dataType: DataType.FLOAT,
        shape: [2, 2],
        data: new ArrayBuffer(16),
      };

      const attributes: AttributeMap = {
        floatAttr: 3.14,
        intAttr: 42,
        stringAttr: 'hello',
        boolAttr: true,
        floatArrayAttr: [1.0, 2.0, 3.0],
        intArrayAttr: [1, 2, 3],
        stringArrayAttr: ['a', 'b', 'c'],
        boolArrayAttr: [true, false, true],
        tensorAttr: tensor,
        tensorArrayAttr: [tensor],
      };

      expect(typeof attributes.floatAttr).toBe('number');
      expect(typeof attributes.stringAttr).toBe('string');
      expect(typeof attributes.boolAttr).toBe('boolean');
      expect(Array.isArray(attributes.floatArrayAttr)).toBe(true);
      expect(attributes.tensorAttr).toBe(tensor);
      expect(Array.isArray(attributes.tensorArrayAttr)).toBe(true);
    });
  });
}); 