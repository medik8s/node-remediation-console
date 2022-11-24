import exp = require("constants");
import { gotoNodeHealthCheckListPage } from "../../Routing";
import {
  DeleteNHC,
  EditNHC,
  PauseNHC,
  UnpauseNHC,
} from "../../views/ActionsView";
import * as NHCTableView from "../../views/NHCTableView";
import _ = require("lodash");
import { validateInEditor } from "../../views/EditorView";

describe("test NodeHealthCheck list view", () => {
  let expectedRows = [
    {
      name: "nhc0",
      status: "Disabled",
      remediator: "Other",
      statusReason:
        'NHC is disabled: RemediationTemplateNotFound: Failed to get remediation template &ObjectReference{Kind:other,Namespace:other,Name:other,UID:,APIVersion:other,ResourceVersion:,FieldPath:,}: no matches for kind "other" in version "other"',
    },
    {
      name: "nhc1",
      status: "Enabled",
      remediator: "Self node remediation",
      statusReason: "NHC is enabled, no ongoing remediation",
    },
    {
      name: "nhc2",
      status: "Paused",
      remediator: "Self node remediation",
      statusReason: "2 pause reasons",
    },
    {
      name: "nhc3",
      status: "Enabled",
      remediator: "Self node remediation",
      statusReason: "NHC is enabled, no ongoing remediation",
    },
  ];
  before(() => {
    cy.task("deleteAllNHCs");
    cy.task("apply", "nodeHealthChecks.json");
    gotoNodeHealthCheckListPage();
  });

  it("show expected node health checks", () => {
    NHCTableView.validateRows(expectedRows);
  });

  it("should delete node health check and not show it in list", () => {
    NHCTableView.toggleKababMenu(0);
    DeleteNHC();
    expectedRows.splice(0, 1);
    NHCTableView.validateRows(expectedRows);
  });

  it("should pause node health check and update the status", () => {
    const pauseRequests = ["reason1", "reason2"];
    NHCTableView.toggleKababMenu(2);
    PauseNHC(pauseRequests);
    NHCTableView.validateStatus(2, "Paused");
  });

  it("should unpause node health check and update the status", () => {
    NHCTableView.toggleKababMenu(1);
    UnpauseNHC();
    NHCTableView.validateStatus(1, "Enabled");
  });

  it("should go to edit page when selecting edit action", () => {
    NHCTableView.toggleKababMenu(0);
    EditNHC();
    validateInEditor();
  });
});
