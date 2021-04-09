export default class Event {
    public params: any;
    public name: string;

    constructor(name: string, params?: any) {
        this.params = params || {};
        this.name = name;
    }
}
