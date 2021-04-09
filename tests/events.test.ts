import SubgraphData from "../src/classes/SubgraphData";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {
  it("Can parse .yml file and get events correctly.", () => {
    const subgraphData = new SubgraphData(yamlString);
    const events = subgraphData.getEvents();
    console.log(events);
  });
});
