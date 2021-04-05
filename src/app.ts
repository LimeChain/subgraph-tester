import { assert } from "chai";
import sinon from "sinon";

const mockReturns: Map<string, any> = new Map();

export const run = (fName: string) => {
  assert(
    mockReturns.get(fName) !== undefined,
    "This function has not yet been mocked."
  );
  return mockReturns.get(fName);
};

export const mock = (contract: any, fName: string, mockReturn: any) => {
  assert(fName in contract.methods, "Function does not exist in contract.");

  const mockRes = sinon.mock().returns(mockReturn)();
  mockReturns.set(fName, mockRes);
};

export const clearMocks = () => {
  mockReturns.clear();
};
