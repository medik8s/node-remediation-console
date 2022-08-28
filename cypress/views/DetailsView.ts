const validateName = (name: string) => {
  cy.get("[data-test-selector=details-item-value__Name]").should(
    "contain",
    name
  );
};

const validateNodeSelector = (selector: string) => {
  cy.get('[data-test-selector="details-item-value__Node selector"]').contains(
    selector
  );
};

const validateRemediator = (remediator: string) => {
  cy.get('[data-test-selector="details-item-value__Remediator"]').contains(
    remediator
  );
};

const validateMinHealthy = (minHealthy: string) => {
  cy.get('[data-test-selector="details-item-value__Min healthy"]').contains(
    minHealthy
  );
};

const validateUnhealthyConditionRow = (
  rowNum: number,
  unhealthyCondition: { type: string; status: string; duration: string }
) => {
  cy.get(`[data-index=${rowNum}][data-test=unhealthy-condition-row]`).within(
    () => {
      cy.get("[data-label=Type]").should("contain", unhealthyCondition.type);
      cy.get("[data-label=Status]").should(
        "contain",
        unhealthyCondition.status
      );
      cy.get("[data-label=Duration]").should(
        "contain",
        unhealthyCondition.duration
      );
    }
  );
};

const validateUnhealthyConditions = (
  unhealthyConditions: { type: string; status: string; duration: string }[]
) => {
  for (let i = 0; i < unhealthyConditions.length; ++i) {
    validateUnhealthyConditionRow(i, unhealthyConditions[i]);
  }
};

const validateStatus = (status) => {
  cy.get('[data-test-selector="details-item-value__Status"]').contains(status);
};

const validateNodes = (type: string) => {
  cy.get(`[data-test-selector="details-item-value__${type} nodes"]`).should(
    (element) => {
      expect(element.text).to.match(/[0-9]+/);
    }
  );
};

const validateObservedNodes = () => {
  validateNodes("Observed");
};

const validateHealthyNodes = () => {
  validateNodes("Healthy");
};

export {
  validateName,
  validateNodeSelector,
  validateRemediator,
  validateUnhealthyConditionRow,
  validateUnhealthyConditions,
  validateMinHealthy,
  validateStatus,
  validateObservedNodes,
  validateHealthyNodes,
};
