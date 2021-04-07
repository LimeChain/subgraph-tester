import equal from "fast-deep-equal/es6";
import Entity from "./Entity";

export default class Store {
    private state: Map<string, Entity> = new Map();

    public hydrateWithEntities = (entities: Map<string, Entity>) => {
        this.state = entities;
    }

    public hydrateWithJson = (stringifiedJson: string) => {
        this.state = new Map(JSON.parse(stringifiedJson));
    }

    public readState = () => {
        return JSON.stringify(Array.from(this.state.entries()));
    }

    public assertEq = (snapshot: string) => {
        const snapshotMap: Map<string, Entity> = new Map(JSON.parse(snapshot));
        return equal(snapshotMap, this.state);
    }
}
