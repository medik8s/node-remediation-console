const expandComputeNav = () => {
  cy.get("[data-quickstart-id=qs-nav-compute]").click();
};

const gotoNodeHealthChecks = () => {
  expandComputeNav();
  cy.contains("NodeHealthChecks").click();
};

const validateNodeHealthChecksPluginLoaded = () => {
  expandComputeNav();
  cy.contains("NodeHealthChecks").should("exist");
};

export { gotoNodeHealthChecks, validateNodeHealthChecksPluginLoaded };
