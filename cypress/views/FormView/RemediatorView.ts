import { selectFromDropdown } from "../Shared";

export type SNRRemediatorStrategy = "Node deletion" | "Resource deletion";

const strategyToggleSelector =
  '[data-test="toggle-Remediation Strategy-dropdown"]';

const getOtherRemediatorElement = (fieldName) => {
  return cy.get(`#form-input-formData-remediator-template-${fieldName}-field`);
};

const selectOtherRemediator = () => {
  cy.get("[data-test=Other-view-input]").click();
};

const selectSNRRemediator = () => {
  cy.get('[data-test="Self node remediation-view-input"]').click();
};

const setOtherRemediatorData = (data: {
  apiVersion: string;
  kind: string;
  namespace: string;
  name: string;
}) => {
  for (const [key, value] of Object.entries(data)) {
    getOtherRemediatorElement(key).type(value);
  }
};

const validateOtherRemediatorData = (data: {
  apiVersion: string;
  kind: string;
  namespace: string;
  name: string;
}) => {
  for (const [key, value] of Object.entries(data)) {
    getOtherRemediatorElement(key).should("have.value", value);
  }
};

const getSnrStrategyDropdownElement = () => {
  return cy.get(strategyToggleSelector);
};

const selectSNRStrategy = (strategy: SNRRemediatorStrategy) => {
  selectFromDropdown(strategyToggleSelector, strategy);
};

const validateSNRStrategy = (strategy: SNRRemediatorStrategy) => {
  getSnrStrategyDropdownElement().contains(strategy).should("exist");
};

export {
  validateOtherRemediatorData,
  validateSNRStrategy,
  selectSNRStrategy,
  setOtherRemediatorData,
  selectOtherRemediator,
  selectSNRRemediator,
};
