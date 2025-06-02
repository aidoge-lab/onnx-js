/**
 * Jest setup file for ONNX Parser tests
 */

// Set test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Export empty object to make this a module
export {}; 