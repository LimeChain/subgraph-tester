// tslint:disable-next-line: no-var-requires
const sparkles = require("sparkles")();
// tslint:disable-next-line: interface-name
interface Object {
    save(): void;
}

Object.prototype.save = function(): void {
    sparkles.emit("persistEntity", this);
};
