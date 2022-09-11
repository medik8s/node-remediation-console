import * as EditorView from "../../views/EditorView";
import * as ConsoleNav from "../../views/ConsoleNav";
import * as ListView from "../../views/NHCTableView";
import * as DetailsView from "../../views/DetailsView";
import {
  addUnhealthyCondition,
  defaultConditions,
  setUnhealthyCondition,
} from "../../views/FormView/UnhealthyConditionsView";
import {
  selectOtherRemediator,
  setOtherRemediatorData,
} from "../../views/FormView/RemediatorView";

const name = "e2e-test-new-nhc-other-remediator";

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

  it("should select other remediator", () => {
    const remediatorData = {
      apiVersion: "a",
      namespace: "b",
      kind: "c",
      name: "d",
    };
    selectOtherRemediator();
    setOtherRemediatorData(remediatorData);
  });

  it("should create and go to details page", () => {
    EditorView.create();
  });

  it("should be in details page of created NHC", () => {
    DetailsView.validatePluginLoaded();
    cy.url().should("contain", `/${name}`);
  });

  it("should show correct name in details page", () => {
    DetailsView.validateName(name);
  });

  it("should show SNR remediator", () => {
    DetailsView.validateRemediator("Other");
  });

  it("should show disabled status", () => {
    DetailsView.validateStatus("Disabled");
  });
});
