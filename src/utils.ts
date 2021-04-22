const hexChar = ["0", "1", "2", "3", "4", "5", "6", "7","8", "9", "A", "B", "C", "D", "E", "F"];
export function byteToHex(b: any) {
    // tslint:disable-next-line: no-bitwise
    return hexChar[(b >> 4) & 0x0f] + hexChar[b & 0x0f];
}
