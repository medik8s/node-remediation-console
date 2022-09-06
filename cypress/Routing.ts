const root = "/k8s/cluster/remediation.medik8s.io~v1alpha1~NodeHealthCheck";

const gotoNewNodeHealthCheck = () => {
  cy.visit(`${root}/~new`);
};

const gotoNodeHealthCheckListPage = (options?: Object) => {
  cy.visit(root, options);
};

const gotoNodeHealthCheckDetails = (name: string) => {
  cy.visit(`${root}/${name}/`);
};

export {
  gotoNewNodeHealthCheck,
  gotoNodeHealthCheckListPage,
  gotoNodeHealthCheckDetails,
};
