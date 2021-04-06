import { assert } from "chai";
import sinon from "sinon";

export interface IMockFunctionArgs {
  // TODO: Create and use a Contract interface
  contract: any;
  fName: string;
  mockReturn: () => {};
  // TODO: convert this to map of args
  withArgs?: any[];
}

export interface IRunFunctionArgs {
  fName: string;
  // TODO: convert this to map of args
  withArgs?: any[];
}

const mockReturns: Map<string, any> = new Map();

export const mock = ({
  fName,
  contract,
  mockReturn,
  withArgs,
}: IMockFunctionArgs) => {
  assert(fName in contract.methods, "Function does not exist in contract.");

  const mockRes = sinon.mock().returns(mockReturn)();
  mockReturns.set(withArgs ? fName.concat(withArgs.join()) : fName, mockRes);
};

export const run = ({ fName, withArgs }: IRunFunctionArgs) => {
  assert(
    mockReturns.get(withArgs ? fName.concat(withArgs.join()) : fName) !==
      undefined,
    "This function has not yet been mocked.",
  );

  return mockReturns.get(withArgs ? fName.concat(withArgs.join()) : fName)();
};

export const clearMocks = () => {
  mockReturns.clear();
};
