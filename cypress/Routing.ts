const root = "/k8s/cluster/remediation.medik8s.io~v1alpha1~NodeHealthCheck";

import * as DetailsPage from "./views/DetailsView";
import * as EditorPage from "./views/EditorView";
import * as TablePage from "./views/NHCTableView";

const gotoNewNodeHealthCheck = () => {
  cy.visit(`${root}/~new`);
  EditorPage.validatePluginLoaded();
};

const gotoNodeHealthCheckListPage = (options?: Object) => {
  cy.visit(root, options);
  TablePage.validatePluginLoaded();
};

const gotoNodeHealthCheckDetails = (name: string) => {
  cy.visit(`${root}/${name}/`);
  DetailsPage.validatePluginLoaded();
};

export {
  gotoNewNodeHealthCheck,
  gotoNodeHealthCheckListPage,
  gotoNodeHealthCheckDetails,
};
