import * as EditorView from "../../views/EditorView";
import * as ConsoleNav from "../../views/ConsoleNav";
import * as ListView from "../../views/NHCTableView";
import * as DetailsView from "../../views/DetailsView";
import {
  addUnhealthyCondition,
  defaultConditions,
  setUnhealthyCondition,
} from "../../views/FormView/UnhealthyConditionsView";

const name = "e2e-test-new-nhc";

describe("Create default NHC", () => {
  before(() => {
    cy.task("deleteNodeHealthCheck", name);
    cy.visit("/");
    ConsoleNav.gotoNodeHealthChecks();
    ListView.validatePluginLoaded();
  });

  it("should click on create", () => {
    ListView.create();
  });

  it("should set name", () => {
    EditorView.setName(name);
  });

  it("should set min value", () => {
    EditorView.setMinHealthy("1");
  });

  it("should add unhealthy condition", () => {
    addUnhealthyCondition();
    setUnhealthyCondition(2, { type: "Memory pressure", duration: "1s" });
  });

  it("should create", () => {
    EditorView.create();
  });

  it("should be in details page of created NHC", () => {
    DetailsView.validatePluginLoaded();
    cy.url().should("contain", `/${name}`);
  });

  it("should show SNR remediator", () => {
    DetailsView.validateRemediator("Self node remediation");
  });

  it("should show three unhealthy conditions in table", () => {
    DetailsView.validateUnhealthyConditions([
      ...defaultConditions,
      { type: "MemoryPressure", duration: "1s", status: "True" },
    ]);
  });
});
