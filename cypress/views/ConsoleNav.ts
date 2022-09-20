const expandComputeNav = () => {
  cy.get("[data-quickstart-id=qs-nav-compute]", { timeout: 60000 }).click();
};

const gotoNodeHealthChecks = () => {
  expandComputeNav();
  cy.contains("NodeHealthChecks", { timeout: 60000 }).click();
};

export { gotoNodeHealthChecks };
