export interface IAbiItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: IAbiInput[];
  name?: string;
  outputs?: IAbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
}

export type AbiType = "function" | "constructor" | "event" | "fallback";
export type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

export interface IAbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: IAbiInput[];
  internalType?: string;
}

export interface IAbiOutput {
  name: string;
  type: string;
  components?: IAbiOutput[];
  internalType?: string;
}

export interface IMockFunctionArgs {
  fName: string;
  mockReturn: () => {};
  withArgs?: any[];
  reverts?: boolean;
  revertsMsg?: string;
}

export interface IRunFunctionArgs {
  fName: string;
  withArgs?: any[];
}
