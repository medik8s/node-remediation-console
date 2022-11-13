import { interceptNodes } from "../../Intercepts";
import { gotoNewNodeHealthCheck } from "../../Routing";
import {
  addLabelToNodeSelector,
  validateNodes,
  validateNodeSelectorLabel,
} from "../../views/FormView/NodeSelectorView";

describe("Node selector field", () => {
  before(() => {
    cy.fixture("nodes.json").then((nodes) => {
      interceptNodes(nodes);
    });
    gotoNewNodeHealthCheck();
  });

  it("selecting a label with one matching node should show that single node", () => {
    addLabelToNodeSelector("test-label", "test-value");
    validateNodeSelectorLabel("test-label", "test-value");
    validateNodes(["test-node"]);
  });
});
