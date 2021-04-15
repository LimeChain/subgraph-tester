import { IMockFunctionArgs, IRunFunctionArgs } from "../../src/models/Contract";
import NewGravatar from "./classes/NewGravatar";
import NewTransfer from "./classes/NewTransfer";

export const newGravatar: NewGravatar = new NewGravatar({
  color: "purple",
  displayName: "Gerard",
  id: "999",
  owner: "0x1234567",
});

export const anotherNewGravatar: NewGravatar = new NewGravatar({
  color: "red",
  displayName: "Don Draper",
  id: "11555",
  owner: "0x1234567",
});

export const newTransfer: NewTransfer = new NewTransfer({
    amount: 5,
    from: "123",
    id: "5000",
    to: "456",
  });

export const anotherNewTransfer: NewTransfer = new NewTransfer({
    amount: 5,
    from: "456",
    id: "333",
    to: "789",
  });

export const mockBody = () => {
  return "myReturnValue";
};

export const baseMockFunctionArgs: IMockFunctionArgs = {
  fName: "transfer",
  mockBody,
};

export const baseRunFunctionArgs: IRunFunctionArgs = {
  eventsToEmit: [],
  fName: "transfer",
};
