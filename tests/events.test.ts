import { expect } from "chai";
import Store from "../src/classes/Store";
import SubgraphData from "../src/classes/SubgraphData";
import "../src/extensions/object";
import "../src/extensions/string";
import NewTransfer from "./mocks/classes/NewTransfer";
import Transfer from "./mocks/classes/Transfer";
import { handleNewGravatar } from "./mocks/eventHandlers";
import {
  anotherNewGravatar,
  anotherNewTransfer,
  newGravatar,
  newTransfer,
} from "./mocks/fixtures";
import yamlString from "./mocks/subgraphYml";

describe("Contract events", () => {
  const store = new Store();

  afterEach(() => {
    store.clear();
  });

  const handleNewTransfer = (event: NewTransfer): void => {
    const transfer = new Transfer(event.params.id.toHex());
    transfer.from = event.params.from;
    transfer.to = event.params.to;
    transfer.amount = event.params.amount;
    transfer.save();
  };

  const subgraphData = new SubgraphData(yamlString);
  const events = subgraphData.getEvents();
  const eventsArray = Array.from(events.entries());

  it("Can parse .yml file and get events correctly.", () => {
    expect(eventsArray).length(3);
    expect(JSON.stringify(eventsArray)).equals(
      `[[0,{"event":"Transfer(address,address,uint256)","handler":"handleTransfer"}],[1,{"event":"Approval(address,address,uint256)","handler":"handleApproval"}],[2,{"event":"NewGravatar(string,address,string,string)","handler":"handleNewGravatar"}]]`,
    );
  });

  it("Can call function handler and populate the state", () => {
    handleNewGravatar(newGravatar);
    expect(store.readStateMap()).length(1);

    const storeMapJSON = store.readStateJson();
    expect(storeMapJSON).equals(
      `[["393939",{"id":"393939","params":{"owner":"0x1234567","displayName":"Gerard","id":"393939"}}]]`,
    );
  });

  it("Can run an events test fixture through a mapping function", () => {
    const gravatarEventsFixture = [newGravatar, anotherNewGravatar];
    const transferEventsFixture = [newTransfer, anotherNewTransfer];

    gravatarEventsFixture.forEach((ge) => {
      handleNewGravatar(ge);
    });

    transferEventsFixture.forEach((te) => {
      handleNewTransfer(te);
    });

    expect(store.readStateMap().size).equals(4);
    expect(store.readStateJson()).equals(
      `[["393939",{"id":"393939","params":{"owner":"0x1234567","displayName":"Gerard","id":"393939"}}],["3131353535",{"id":"3131353535","params":{"owner":"0x1234567","displayName":"Don Draper","id":"3131353535"}}],["35303030",{"id":"35303030","params":{"id":"35303030","to":"456","from":"123","amount":5}}],["333333",{"id":"333333","params":{"id":"333333","to":"789","from":"456","amount":5}}]]`,
    );
  });
});
