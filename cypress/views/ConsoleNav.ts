const expandComputeNav = () => {
  cy.get("[data-quickstart-id=qs-nav-compute]", { timeout: 120000 }).click();
};

const gotoNodeHealthChecks = () => {
  expandComputeNav();
  cy.contains("NodeHealthChecks", { timeout: 120000 }).click();
};

export { gotoNodeHealthChecks };
