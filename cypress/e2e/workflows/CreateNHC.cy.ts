import * as EditorView from "../../views/EditorView";
import * as ConsoleNav from "../../views/ConsoleNav";
import * as ListView from "../../views/NHCTableView";
import * as DetailsView from "../../views/DetailsView";
import {
  addUnhealthyCondition,
  setUnhealthyCondition,
} from "../../views/FormView/UnhealthyConditionsView";
const name = "e2e-test-new-nhc";

describe("Create default NHC", () => {
  before(() => {
    cy.task("deleteNodeHealthCheck", name);
    cy.visit("/");
    ConsoleNav.gotoNodeHealthChecks();
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
    setUnhealthyCondition(1, { type: "Memory pressure", duration: "1s" });
  });

  it("should create and go to details page", () => {
    EditorView.create();
  });

  it("should show correct name in details page", () => {
    cy.url().should("contain", `/${name}`);
    DetailsView.validateName(name);
  });

  it("should show SNR remediator", () => {
    DetailsView.validateRemediator("Self node remediation");
  });

  it("should show two unhealthy conditions in table", () => {
    DetailsView.validateUnhealthyConditions([
      {
        type: "Ready",
        status: "False",
        duration: "300s",
      },
      { type: "MemoryPressure", duration: "1s", status: "True" },
    ]);
  });
});
