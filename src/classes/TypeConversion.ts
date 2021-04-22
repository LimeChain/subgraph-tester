import { byteToHex } from "../utils";

export default class TypeConversion {
    public stringToH160 = (s: string) => {
        return new TextEncoder().encode(s);
    }
    public bytesToHex = (bytes: Uint8Array) => {
        return byteToHex(bytes);
    }
}
