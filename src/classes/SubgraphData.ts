import yaml from "yaml";

export default class SubgraphData {
  public data: any;

  constructor(yamlString: string) {
    this.data = yaml.parse(yamlString);
  }
}
