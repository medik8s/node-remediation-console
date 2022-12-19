const interceptNodes = (response) => {
  cy.intercept("GET", "/api/kubernetes/api/v1/nodes**", response);
};

const interceptNodesWithLabelSelector = (response) => {
  cy.intercept("GET", "/api/kubernetes/api/v1/nodes?labelSelector**", response);
};

export { interceptNodes, interceptNodesWithLabelSelector };
