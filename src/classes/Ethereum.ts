// TODO: Need to research this

class EthereumValue {
  public kind: string | undefined;
  public data: any;
}

// tslint:disable-next-line: max-classes-per-file
class SmartContractCall {
  public contractName: string;
  public contractAddress: Uint8Array;
  public functionName: string;
  public functionParams: EthereumValue[];

  constructor(
    contractName: string,
    contractAddress: Uint8Array,
    functionName: string,
    functionParams: EthereumValue[],
  ) {
    this.contractName = contractName;
    this.contractAddress = contractAddress;
    this.functionName = functionName;
    this.functionParams = functionParams;
  }
}

// tslint:disable-next-line: max-classes-per-file
export default class Ethereum {
  public call = (call: SmartContractCall): EthereumValue[] | null => {
    return null;
  }
}
