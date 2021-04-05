
import Web3 from "web3";
import { address, ERC20TransferABI } from "./mocks/sampleContractABI";

const web3 = new Web3("https://cloudflare-eth.com");
const sampleContract = new web3.eth.Contract(ERC20TransferABI , address);
console.log("transfer" in sampleContract.methods);
