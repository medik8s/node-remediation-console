const interceptNodes = (response) => {
  cy.intercept("GET", "/api/kubernetes/api/v1/nodes**", response);
};

export { interceptNodes };
