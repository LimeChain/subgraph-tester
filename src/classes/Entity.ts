export default class Entity {
    public id: string;
    public type: string;
    public data: any;

    constructor(id: string, type: string, data: string) {
        this.id = id;
        this.type = type;
        this.data = data;
    }
}
