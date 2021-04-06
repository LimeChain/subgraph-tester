import { assert } from "chai";
import sha256 from "crypto-js/sha256";
import sinon from "sinon";

export interface IMockFunctionArgs {
  // TODO: Create and use a Contract interface
  contract: any;
  fName: string;
  mockReturn: () => {};
  withArgs?: any[];
}

export interface IRunFunctionArgs {
  fName: string;
  withArgs?: any[];
}

const mockReturns: Map<string, any> = new Map();

export const mock = ({
  fName,
  contract,
  mockReturn,
  withArgs,
}: IMockFunctionArgs) => {
  const raw = withArgs ? fName.concat(JSON.stringify(withArgs)) : fName;
  const key = sha256(raw).toString();

  assert(fName in contract.methods, "Function does not exist in contract.");

  const mockRes = sinon.mock().returns(mockReturn)();
  mockReturns.set(key, mockRes);
};

export const run = ({ fName, withArgs }: IRunFunctionArgs) => {
  const raw = withArgs ? fName.concat(JSON.stringify(withArgs)) : fName;
  const key = sha256(raw).toString();

  assert(
    mockReturns.get(key) !== undefined,
    "This function has not been mocked yet.",
  );

  return mockReturns.get(key)();
};

export const clearMocks = () => {
  mockReturns.clear();
};
