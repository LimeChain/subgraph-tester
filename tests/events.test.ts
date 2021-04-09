import SubgraphData from "../src/classes/SubgraphData";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {
  it("Can parse .yml file correctly.", () => {
    const subgraphData = new SubgraphData(yamlString);

    // TODO: Should we always get the first?
    // const eventsData = subgraphData.data.dataSources[0].mapping.eventHandlers;
  });
});
