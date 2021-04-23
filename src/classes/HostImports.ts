import BigDecimal from "./BigDecimal";
import BigInt from "./BigInt";
import DataSource from "./DataSource";
import Ethereum from "./Ethereum";
import Store from "./Store";
import TypeConversion from "./TypeConversion";

const bigDecimal = new BigDecimal();
const bigInt = new BigInt();
const dataSource = new DataSource();
const typeConversion = new TypeConversion();
const store = new Store();

export default {
  env: {
    // tslint:disable-next-line: variable-name
    abort(_msg: any, _file: any, line: any, column: any) {
      // tslint:disable-next-line: no-console
      console.error("abort called at index.ts:" + line + ":" + column);
    },
  },
  ethereum: {},
  index: {
    // tslint:disable-next-line: object-literal-key-quotes
    memory: new WebAssembly.Memory({
      initial: 256,
      maximum: 512,
    }),
    // tslint:disable-next-line: object-literal-key-quotes
    memoryBase: 0,
    // tslint:disable-next-line: object-literal-key-quotes
    table: new WebAssembly.Table({
      element: "anyfunc",
      initial: 0,
      maximum: 0,
    }),
    // tslint:disable-next-line: object-literal-key-quotes
    tableBase: 0,
    // tslint:disable-next-line: object-literal-sort-keys
    "bigDecimal.fromString": bigDecimal.fromString,
    "bigInt.times": bigInt.times,
    "typeConversion.stringToH160": typeConversion.stringToH160,
    "store.get": store.get,
    "ethereum.call": Ethereum.call,
    "bigDecimal.dividedBy": bigDecimal.dividedBy,
    "typeConversion.bytesToHex": typeConversion.bytesToHex,
    "bigDecimal.times": bigDecimal.times,
    "store.set": store.set,
    "dataSource.create": dataSource.create,
    "bigInt.plus": bigInt.plus,
  },
};
