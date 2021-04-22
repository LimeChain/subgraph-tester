// tslint:disable-next-line: class-name
export default class HostBigInt implements BigInt {
    public [Symbol.toStringTag]: "BigInt";
    private value: bigint;

    constructor(value: bigint) {
        this.value = value;
    }
    public toString(radix?: number): string {
        return this.value.toString();
    }
    public toLocaleString(locales?: string, options?: any): string {
        return this.value.toString();
    }
    public valueOf(): bigint {
        return this.value;
    }
    public times(x: BigInt, y: BigInt): BigInt {
        return x.valueOf() * y.valueOf();
    }
    public plus(x: BigInt, y: BigInt): BigInt {
        return x.valueOf() + y.valueOf();
    }
}
