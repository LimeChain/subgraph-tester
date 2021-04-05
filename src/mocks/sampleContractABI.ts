// TODO: get these from index.d.ts in web3
interface IAbiItem {
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

type AbiType = "function" | "constructor" | "event" | "fallback";
type StateMutabilityType = "pure" | "view" | "nonpayable" | "payable";

interface IAbiInput {
    name: string;
    type: string;
    indexed?: boolean;
    components?: IAbiInput[];
    internalType?: string;
}

interface IAbiOutput {
    name: string;
    type: string;
    components?: IAbiOutput[];
    internalType?: string;
}

export const ERC20TransferABI: IAbiItem[]  = [
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];

export const address = "0x6b175474e89094c44da98b954eedeac495271d0f";
