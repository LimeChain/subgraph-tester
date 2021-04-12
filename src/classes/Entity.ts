export default class Entity {
    public id: string;
    public params: any;

    constructor(id: string, params?: any) {
        this.id = id;
        this.params = params || {};
    }
}
