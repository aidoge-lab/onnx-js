/**
 * Generated JavaScript code for ONNX protobuf
 * Auto-generated from onnx.proto
 */

import protobuf from 'protobufjs/minimal.js';

// Configure protobuf.js
protobuf.util.Long = undefined;
protobuf.configure();


const onnx = {};

// Export the protobuf root for dynamic access
onnx.root = {
  "nested": {
    "onnx": {
      "options": {
        "optimize_for": "LITE_RUNTIME"
      },
      "nested": {
        "Version": {
          "edition": "proto2",
          "values": {
            "_START_VERSION": 0,
            "IR_VERSION_2017_10_10": 1,
            "IR_VERSION_2017_10_30": 2,
            "IR_VERSION_2017_11_3": 3,
            "IR_VERSION_2019_1_22": 4,
            "IR_VERSION_2019_3_18": 5,
            "IR_VERSION_2019_9_19": 6,
            "IR_VERSION_2020_5_8": 7,
            "IR_VERSION_2021_7_30": 8,
            "IR_VERSION_2023_5_5": 9,
            "IR_VERSION_2024_3_25": 10,
            "IR_VERSION": 11
          }
        },
        "AttributeProto": {
          "edition": "proto2",
          "fields": {
            "name": {
              "type": "string",
              "id": 1
            },
            "refAttrName": {
              "type": "string",
              "id": 21
            },
            "docString": {
              "type": "string",
              "id": 13
            },
            "type": {
              "type": "AttributeType",
              "id": 20
            },
            "f": {
              "type": "float",
              "id": 2
            },
            "i": {
              "type": "int64",
              "id": 3
            },
            "s": {
              "type": "bytes",
              "id": 4
            },
            "t": {
              "type": "TensorProto",
              "id": 5
            },
            "g": {
              "type": "GraphProto",
              "id": 6
            },
            "sparseTensor": {
              "type": "SparseTensorProto",
              "id": 22
            },
            "tp": {
              "type": "TypeProto",
              "id": 14
            },
            "floats": {
              "rule": "repeated",
              "type": "float",
              "id": 7
            },
            "ints": {
              "rule": "repeated",
              "type": "int64",
              "id": 8
            },
            "strings": {
              "rule": "repeated",
              "type": "bytes",
              "id": 9
            },
            "tensors": {
              "rule": "repeated",
              "type": "TensorProto",
              "id": 10
            },
            "graphs": {
              "rule": "repeated",
              "type": "GraphProto",
              "id": 11
            },
            "sparseTensors": {
              "rule": "repeated",
              "type": "SparseTensorProto",
              "id": 23
            },
            "typeProtos": {
              "rule": "repeated",
              "type": "TypeProto",
              "id": 15
            }
          },
          "reserved": [
            [
              12,
              12
            ],
            [
              16,
              19
            ],
            "v"
          ],
          "nested": {
            "AttributeType": {
              "values": {
                "UNDEFINED": 0,
                "FLOAT": 1,
                "INT": 2,
                "STRING": 3,
                "TENSOR": 4,
                "GRAPH": 5,
                "SPARSE_TENSOR": 11,
                "TYPE_PROTO": 13,
                "FLOATS": 6,
                "INTS": 7,
                "STRINGS": 8,
                "TENSORS": 9,
                "GRAPHS": 10,
                "SPARSE_TENSORS": 12,
                "TYPE_PROTOS": 14
              }
            }
          }
        },
        "ValueInfoProto": {
          "edition": "proto2",
          "fields": {
            "name": {
              "type": "string",
              "id": 1
            },
            "type": {
              "type": "TypeProto",
              "id": 2
            },
            "docString": {
              "type": "string",
              "id": 3
            },
            "metadataProps": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 4
            }
          }
        },
        "NodeProto": {
          "edition": "proto2",
          "fields": {
            "input": {
              "rule": "repeated",
              "type": "string",
              "id": 1
            },
            "output": {
              "rule": "repeated",
              "type": "string",
              "id": 2
            },
            "name": {
              "type": "string",
              "id": 3
            },
            "opType": {
              "type": "string",
              "id": 4
            },
            "domain": {
              "type": "string",
              "id": 7
            },
            "overload": {
              "type": "string",
              "id": 8
            },
            "attribute": {
              "rule": "repeated",
              "type": "AttributeProto",
              "id": 5
            },
            "docString": {
              "type": "string",
              "id": 6
            },
            "metadataProps": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 9
            },
            "deviceConfigurations": {
              "rule": "repeated",
              "type": "NodeDeviceConfigurationProto",
              "id": 10
            }
          }
        },
        "IntIntListEntryProto": {
          "edition": "proto2",
          "fields": {
            "key": {
              "type": "int64",
              "id": 1
            },
            "value": {
              "rule": "repeated",
              "type": "int64",
              "id": 2
            }
          }
        },
        "NodeDeviceConfigurationProto": {
          "edition": "proto2",
          "fields": {
            "configurationId": {
              "type": "string",
              "id": 1
            },
            "shardingSpec": {
              "rule": "repeated",
              "type": "ShardingSpecProto",
              "id": 2
            },
            "pipelineStage": {
              "type": "int32",
              "id": 3
            }
          }
        },
        "ShardingSpecProto": {
          "edition": "proto2",
          "fields": {
            "tensorName": {
              "type": "string",
              "id": 1
            },
            "device": {
              "rule": "repeated",
              "type": "int64",
              "id": 2
            },
            "indexToDeviceGroupMap": {
              "rule": "repeated",
              "type": "IntIntListEntryProto",
              "id": 3
            },
            "shardedDim": {
              "rule": "repeated",
              "type": "ShardedDimProto",
              "id": 4
            }
          }
        },
        "ShardedDimProto": {
          "edition": "proto2",
          "fields": {
            "axis": {
              "type": "int64",
              "id": 1
            },
            "simpleSharding": {
              "rule": "repeated",
              "type": "SimpleShardedDimProto",
              "id": 2
            }
          }
        },
        "SimpleShardedDimProto": {
          "edition": "proto2",
          "oneofs": {
            "dim": {
              "oneof": [
                "dimValue",
                "dimParam"
              ]
            }
          },
          "fields": {
            "dimValue": {
              "type": "int64",
              "id": 1
            },
            "dimParam": {
              "type": "string",
              "id": 2
            },
            "numShards": {
              "type": "int64",
              "id": 3
            }
          }
        },
        "TrainingInfoProto": {
          "edition": "proto2",
          "fields": {
            "initialization": {
              "type": "GraphProto",
              "id": 1
            },
            "algorithm": {
              "type": "GraphProto",
              "id": 2
            },
            "initializationBinding": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 3
            },
            "updateBinding": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 4
            }
          }
        },
        "ModelProto": {
          "edition": "proto2",
          "fields": {
            "irVersion": {
              "type": "int64",
              "id": 1
            },
            "opsetImport": {
              "rule": "repeated",
              "type": "OperatorSetIdProto",
              "id": 8
            },
            "producerName": {
              "type": "string",
              "id": 2
            },
            "producerVersion": {
              "type": "string",
              "id": 3
            },
            "domain": {
              "type": "string",
              "id": 4
            },
            "modelVersion": {
              "type": "int64",
              "id": 5
            },
            "docString": {
              "type": "string",
              "id": 6
            },
            "graph": {
              "type": "GraphProto",
              "id": 7
            },
            "metadataProps": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 14
            },
            "trainingInfo": {
              "rule": "repeated",
              "type": "TrainingInfoProto",
              "id": 20
            },
            "functions": {
              "rule": "repeated",
              "type": "FunctionProto",
              "id": 25
            },
            "configuration": {
              "rule": "repeated",
              "type": "DeviceConfigurationProto",
              "id": 26
            }
          }
        },
        "DeviceConfigurationProto": {
          "edition": "proto2",
          "fields": {
            "name": {
              "type": "string",
              "id": 1
            },
            "numDevices": {
              "type": "int32",
              "id": 2
            },
            "device": {
              "rule": "repeated",
              "type": "string",
              "id": 3
            }
          }
        },
        "StringStringEntryProto": {
          "edition": "proto2",
          "fields": {
            "key": {
              "type": "string",
              "id": 1
            },
            "value": {
              "type": "string",
              "id": 2
            }
          }
        },
        "TensorAnnotation": {
          "edition": "proto2",
          "fields": {
            "tensorName": {
              "type": "string",
              "id": 1
            },
            "quantParameterTensorNames": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 2
            }
          }
        },
        "GraphProto": {
          "edition": "proto2",
          "fields": {
            "node": {
              "rule": "repeated",
              "type": "NodeProto",
              "id": 1
            },
            "name": {
              "type": "string",
              "id": 2
            },
            "initializer": {
              "rule": "repeated",
              "type": "TensorProto",
              "id": 5
            },
            "sparseInitializer": {
              "rule": "repeated",
              "type": "SparseTensorProto",
              "id": 15
            },
            "docString": {
              "type": "string",
              "id": 10
            },
            "input": {
              "rule": "repeated",
              "type": "ValueInfoProto",
              "id": 11
            },
            "output": {
              "rule": "repeated",
              "type": "ValueInfoProto",
              "id": 12
            },
            "valueInfo": {
              "rule": "repeated",
              "type": "ValueInfoProto",
              "id": 13
            },
            "quantizationAnnotation": {
              "rule": "repeated",
              "type": "TensorAnnotation",
              "id": 14
            },
            "metadataProps": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 16
            }
          },
          "reserved": [
            [
              3,
              3
            ],
            [
              4,
              4
            ],
            [
              6,
              9
            ],
            "ir_version",
            "producer_version",
            "producer_tag",
            "domain"
          ]
        },
        "TensorProto": {
          "edition": "proto2",
          "fields": {
            "dims": {
              "rule": "repeated",
              "type": "int64",
              "id": 1
            },
            "dataType": {
              "type": "int32",
              "id": 2
            },
            "segment": {
              "type": "Segment",
              "id": 3
            },
            "floatData": {
              "rule": "repeated",
              "type": "float",
              "id": 4,
              "options": {
                "packed": true
              }
            },
            "int32Data": {
              "rule": "repeated",
              "type": "int32",
              "id": 5,
              "options": {
                "packed": true
              }
            },
            "stringData": {
              "rule": "repeated",
              "type": "bytes",
              "id": 6
            },
            "int64Data": {
              "rule": "repeated",
              "type": "int64",
              "id": 7,
              "options": {
                "packed": true
              }
            },
            "name": {
              "type": "string",
              "id": 8
            },
            "docString": {
              "type": "string",
              "id": 12
            },
            "rawData": {
              "type": "bytes",
              "id": 9
            },
            "externalData": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 13
            },
            "dataLocation": {
              "type": "DataLocation",
              "id": 14
            },
            "doubleData": {
              "rule": "repeated",
              "type": "double",
              "id": 10,
              "options": {
                "packed": true
              }
            },
            "uint64Data": {
              "rule": "repeated",
              "type": "uint64",
              "id": 11,
              "options": {
                "packed": true
              }
            },
            "metadataProps": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 16
            }
          },
          "nested": {
            "DataType": {
              "values": {
                "UNDEFINED": 0,
                "FLOAT": 1,
                "UINT8": 2,
                "INT8": 3,
                "UINT16": 4,
                "INT16": 5,
                "INT32": 6,
                "INT64": 7,
                "STRING": 8,
                "BOOL": 9,
                "FLOAT16": 10,
                "DOUBLE": 11,
                "UINT32": 12,
                "UINT64": 13,
                "COMPLEX64": 14,
                "COMPLEX128": 15,
                "BFLOAT16": 16,
                "FLOAT8E4M3FN": 17,
                "FLOAT8E4M3FNUZ": 18,
                "FLOAT8E5M2": 19,
                "FLOAT8E5M2FNUZ": 20,
                "UINT4": 21,
                "INT4": 22,
                "FLOAT4E2M1": 23
              }
            },
            "Segment": {
              "fields": {
                "begin": {
                  "type": "int64",
                  "id": 1
                },
                "end": {
                  "type": "int64",
                  "id": 2
                }
              }
            },
            "DataLocation": {
              "values": {
                "DEFAULT": 0,
                "EXTERNAL": 1
              }
            }
          }
        },
        "SparseTensorProto": {
          "edition": "proto2",
          "fields": {
            "values": {
              "type": "TensorProto",
              "id": 1
            },
            "indices": {
              "type": "TensorProto",
              "id": 2
            },
            "dims": {
              "rule": "repeated",
              "type": "int64",
              "id": 3
            }
          }
        },
        "TensorShapeProto": {
          "edition": "proto2",
          "fields": {
            "dim": {
              "rule": "repeated",
              "type": "Dimension",
              "id": 1
            }
          },
          "nested": {
            "Dimension": {
              "oneofs": {
                "value": {
                  "oneof": [
                    "dimValue",
                    "dimParam"
                  ]
                }
              },
              "fields": {
                "dimValue": {
                  "type": "int64",
                  "id": 1
                },
                "dimParam": {
                  "type": "string",
                  "id": 2
                },
                "denotation": {
                  "type": "string",
                  "id": 3
                }
              }
            }
          }
        },
        "TypeProto": {
          "edition": "proto2",
          "oneofs": {
            "value": {
              "oneof": [
                "tensorType",
                "sequenceType",
                "mapType",
                "optionalType",
                "sparseTensorType"
              ]
            }
          },
          "fields": {
            "tensorType": {
              "type": "Tensor",
              "id": 1
            },
            "sequenceType": {
              "type": "Sequence",
              "id": 4
            },
            "mapType": {
              "type": "Map",
              "id": 5
            },
            "optionalType": {
              "type": "Optional",
              "id": 9
            },
            "sparseTensorType": {
              "type": "SparseTensor",
              "id": 8
            },
            "denotation": {
              "type": "string",
              "id": 6
            }
          },
          "nested": {
            "Tensor": {
              "fields": {
                "elemType": {
                  "type": "int32",
                  "id": 1
                },
                "shape": {
                  "type": "TensorShapeProto",
                  "id": 2
                }
              }
            },
            "Sequence": {
              "fields": {
                "elemType": {
                  "type": "TypeProto",
                  "id": 1
                }
              }
            },
            "Map": {
              "fields": {
                "keyType": {
                  "type": "int32",
                  "id": 1
                },
                "valueType": {
                  "type": "TypeProto",
                  "id": 2
                }
              }
            },
            "Optional": {
              "fields": {
                "elemType": {
                  "type": "TypeProto",
                  "id": 1
                }
              }
            },
            "SparseTensor": {
              "fields": {
                "elemType": {
                  "type": "int32",
                  "id": 1
                },
                "shape": {
                  "type": "TensorShapeProto",
                  "id": 2
                }
              }
            }
          }
        },
        "OperatorSetIdProto": {
          "edition": "proto2",
          "fields": {
            "domain": {
              "type": "string",
              "id": 1
            },
            "version": {
              "type": "int64",
              "id": 2
            }
          }
        },
        "OperatorStatus": {
          "edition": "proto2",
          "values": {
            "EXPERIMENTAL": 0,
            "STABLE": 1
          }
        },
        "FunctionProto": {
          "edition": "proto2",
          "fields": {
            "name": {
              "type": "string",
              "id": 1
            },
            "input": {
              "rule": "repeated",
              "type": "string",
              "id": 4
            },
            "output": {
              "rule": "repeated",
              "type": "string",
              "id": 5
            },
            "attribute": {
              "rule": "repeated",
              "type": "string",
              "id": 6
            },
            "attributeProto": {
              "rule": "repeated",
              "type": "AttributeProto",
              "id": 11
            },
            "node": {
              "rule": "repeated",
              "type": "NodeProto",
              "id": 7
            },
            "docString": {
              "type": "string",
              "id": 8
            },
            "opsetImport": {
              "rule": "repeated",
              "type": "OperatorSetIdProto",
              "id": 9
            },
            "domain": {
              "type": "string",
              "id": 10
            },
            "overload": {
              "type": "string",
              "id": 13
            },
            "valueInfo": {
              "rule": "repeated",
              "type": "ValueInfoProto",
              "id": 12
            },
            "metadataProps": {
              "rule": "repeated",
              "type": "StringStringEntryProto",
              "id": 14
            }
          },
          "reserved": [
            [
              2,
              2
            ],
            "since_version",
            [
              3,
              3
            ],
            "status"
          ]
        }
      }
    }
  }
};

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


export { onnx };
