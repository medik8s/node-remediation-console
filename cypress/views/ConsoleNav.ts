const expandComputeNav = () => {
  cy.get("[data-quickstart-id=qs-nav-compute]", { timeout: 6000 }).click();
};

const gotoNodeHealthChecks = () => {
  expandComputeNav();
  cy.contains("NodeHealthChecks", { timeout: 6000 }).click();
};

export { gotoNodeHealthChecks };
