export default `dataSources:
  - kind: ethereum/contract
    name: MockContract
    network: mainnet
    source:
      abi: MockContract
      startBlock: 1
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.1
      language: wasm/assemblyscript
      entities:
        - MockEntity
      abis:
        - name: MockContract
      eventHandlers:
        - event: Transfer(address,address,uint256)
          handler: handleTransfer
        - event: Approval(address,address,uint256)
          handler: handleApproval
        - event: NewGravatar(string,address,string,string)
          handler: handleNewGravatar`;
