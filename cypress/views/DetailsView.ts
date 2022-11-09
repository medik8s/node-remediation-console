import { UnhealthyCondition } from "./FormView/UnhealthyConditionsView";

const validateName = (name: string) => {
  cy.get("[data-test-selector=details-item-value__Name]").should(
    "contain",
    name
  );
};

const validateNodeSelector = (selector: string) => {
  cy.get('[data-test-selector="details-item-value__Node selector"]').should(
    "contain",
    selector
  );
};

const validateRemediator = (remediator: string) => {
  cy.get('[data-test-selector="details-item-value__Remediator"]').should(
    "contain",
    remediator
  );
};

const validateMinHealthy = (minHealthy: string | number) => {
  cy.get('[data-test-selector="details-item-value__Min healthy"]').should(
    "contain",
    minHealthy
  );
};

const validateUnhealthyConditionRow = (
  rowNum: number,
  unhealthyCondition: UnhealthyCondition
) => {
  cy.get(`[data-index=${rowNum}][data-test=unhealthy-condition-row]`).within(
    () => {
      cy.get("[data-label=Type]").should("contain", unhealthyCondition.type);
      if (unhealthyCondition.status) {
        cy.get("[data-label=Status]").should(
          "contain",
          unhealthyCondition.status
        );
      }
      cy.get("[data-label=Duration]").should(
        "contain",
        unhealthyCondition.duration
      );
    }
  );
};

const validateUnhealthyConditions = (
  unhealthyConditions: UnhealthyCondition[]
) => {
  for (let i = 0; i < unhealthyConditions.length; ++i) {
    validateUnhealthyConditionRow(i, unhealthyConditions[i]);
  }
};

const validateStatus = (status) => {
  cy.get('[data-test-selector="details-item-value__Status"]').should(
    "contain",
    status
  );
};

const validateNodes = (type: string) => {
  cy.get(`[data-test-selector="details-item-value__${type} nodes"]`).should(
    (element) => {
      expect(element.text()).to.match(/[0-9]+/);
    }
  );
};

const validateObservedNodes = () => {
  validateNodes("Observed");
};

const validateHealthyNodes = () => {
  validateNodes("Healthy");
};

const validatePluginLoaded = () => {
  cy.get("[data-test=unhealthy-condition-row]", { timeout: 120000 }).should(
    "exist"
  );
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
  validatePluginLoaded,
};
