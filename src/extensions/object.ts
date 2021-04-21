// tslint:disable-next-line: no-var-requires
const sparkles = require("sparkles")();
// tslint:disable-next-line: interface-name
interface Object {
    save(): void;
    emit(): void;
}

Object.prototype.save = function(): void {
    sparkles.emit("persistEntity", this);
};

Object.prototype.emit = function(): void {
    sparkles.emit("emitEvent", this);
};
