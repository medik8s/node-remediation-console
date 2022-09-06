import * as EditorView from "../../views/EditorView";
import * as Routing from "../../Routing";
import {
  selectOtherRemediator,
  setOtherRemediatorData,
  validateOtherRemediatorData,
  selectSNRRemediator,
  selectSNRStrategy,
  validateSNRStrategy,
} from "../../views/FormView/RemediatorView";

describe("Remediator field", () => {
  before(() => {
    Routing.gotoNewNodeHealthCheck();
  });

  it("should select other remediator", () => {
    const remediatorData = {
      apiVersion: "a",
      namespace: "b",
      kind: "c",
      name: "d",
    };
    selectOtherRemediator();
    setOtherRemediatorData(remediatorData);
    validateOtherRemediatorData(remediatorData);
  });

  it("should switch back to SNR remediator ", () => {
    selectSNRRemediator();
  });

  it("should select node deletion stratey", () => {
    selectSNRRemediator();
    selectSNRStrategy("Node deletion");
    validateSNRStrategy("Node deletion");
  });
});
