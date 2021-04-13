// tslint:disable-next-line: interface-name
interface String {
    toHex(str: string): string;
}

String.prototype.toHex = function(): string {
    return Buffer.from(this.toString(), "utf-8").toString("hex");
};
