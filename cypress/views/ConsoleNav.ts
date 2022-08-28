const gotoNodeHealthChecks = () => {
  cy.get("[data-quickstart-id=qs-nav-compute]").click();
  cy.contains("NodeHealthChecks").click();
};

export { gotoNodeHealthChecks };
