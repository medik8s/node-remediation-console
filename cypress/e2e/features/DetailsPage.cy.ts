import { gotoNodeHealthCheckDetails } from "../../Routing";
import {
  validateHealthyNodes,
  validateMinHealthy,
  validateName,
  validateNodeSelector,
  validateObservedNodes,
  validateRemediator,
  validateStatus,
  validateUnhealthyConditions,
} from "../../views/DetailsView";

import { NodeHealthCheck } from "../../../src/data/types";

describe("test details page", () => {
  let nodeHealthCheck: NodeHealthCheck;
  before(() => {
    cy.fixture("testDetailsPage.json").then((data) => {
      nodeHealthCheck = data.items[0];
      cy.task("deleteNodeHealthCheck", nodeHealthCheck.metadata.name);
      cy.task("apply", "testDetailsPage.json");
      gotoNodeHealthCheckDetails(nodeHealthCheck.metadata.name);
    });
  });

  it("should show node health check name in the title", () => {
    validateName(nodeHealthCheck.metadata.name);
  });

  it("should show correct name", () => {
    validateNodeSelector("node-role.kubernetes.io/worker");
  });

  it("should show correct remediator", () => {
    validateRemediator("Self node remediation");
  });

  it("should show correct min healthy", () => {
    validateMinHealthy(nodeHealthCheck.spec.minHealthy);
  });

  it("should show correct status", () => {
    validateStatus("Enabled");
  });

  it("should show correct unhealthy conditions", () => {
    validateUnhealthyConditions(nodeHealthCheck.spec.unhealthyConditions);
  });

  it("should show a number for healthy nodes", () => {
    validateHealthyNodes();
  });

  it("should show a number for observed nodes", () => {
    validateObservedNodes();
  });
});
