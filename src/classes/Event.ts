export default class Event {
    public parameters: any;
    public name: string;

    constructor(name: string, parameters: any) {
        this.parameters = parameters;
        this.name = name;
    }
}
