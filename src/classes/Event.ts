export default class Event {
    public name: string;
    public params: any;

    constructor(name: string, params?: any) {
        this.name = name;
        this.params = params || {};
    }
}
