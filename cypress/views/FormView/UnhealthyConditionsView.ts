import { selectFromDropdown } from "../Shared";

export type UnhealthyConditionStatus = "True" | "False" | "Unknown";
export type UnhealthyCondition = {
  duration: string;
  status?: UnhealthyConditionStatus;
  isCustomType?: boolean;
  type: string;
};

const typeSelector = "[data-test=toggle-Type-dropdown]";
const statusSelector = "[data-test=toggle-Status-dropdown]";
const durationSelector = "[data-test=duration-input]";
const addMoreSelector = "[data-test=add-unhealthy-condition]";
const removeSelector = "[data-test=remove-unhealthy-condition]";
const itemSelector = "[data-test=unhealthy-condition]";

const getItemSelector = (idx) => {
  return `${itemSelector}[data-index=${idx}]`;
};

const getTypeSelector = (idx) => {
  return `${getItemSelector(idx)} ${typeSelector}`;
};

const getStatusSelector = (idx) => {
  return `${getItemSelector(idx)} ${statusSelector}`;
};

const getDurationSelector = (idx) => {
  return `${getItemSelector(idx)} ${durationSelector}`;
};

const validateUnhealthyCondition = (
  idx: number,
  condition: UnhealthyCondition
) => {
  cy.get(getTypeSelector(idx)).should("contain", condition.type);
  if (condition.status) {
    cy.get(getStatusSelector(idx)).should("contain", condition.status);
  }
  cy.get(getDurationSelector(idx)).should("have.value", condition.duration);
};

const validateUnhealthyConditions = (conditions: UnhealthyCondition[]) => {
  for (let i = 0; i < conditions.length; ++i) {
    validateUnhealthyCondition(i, conditions[i]);
  }
};

const setType = (idx: number, type: string) => {
  selectFromDropdown(getTypeSelector(idx), type);
};

const setStatus = (idx: number, status: string) => {
  selectFromDropdown(getStatusSelector(idx), status);
};

const setDuration = (idx: number, duration: string) => {
  cy.get(getDurationSelector(idx)).type(duration);
};

const clickAddUnhealthyCondition = () => {
  cy.get(addMoreSelector).click();
};

const setCustomType = (idx: number, type: string) => {
  setType(idx, "Use custom type");
  cy.get("[data-test=custom-type-input]").type(type);
  cy.get("[data-test=confirm-custom-type]").click();
};

const addUnhealthyCondition = () => {
  clickAddUnhealthyCondition();
};

const validateNumUnhealthyConditions = (num: number) => {
  cy.get(itemSelector).should("have.length", num);
};

const setUnhealthyCondition = (idx: number, condition: UnhealthyCondition) => {
  if (condition.isCustomType) {
    setCustomType(idx, condition.type);
  } else {
    setType(idx, condition.type);
  }
  if (condition.status) {
    setStatus(idx, condition.status);
  }
  setDuration(idx, condition.duration);
};

const removeUnhealthyCondition = () => {
  cy.get(removeSelector).click();
};

const validateStatusDisabled = (idx: number) => {
  cy.get(getStatusSelector(idx)).should("be.disabled");
};

export const defaultConditions: UnhealthyCondition[] = [
  {
    duration: "300s",
    type: "Ready",
    status: "False",
  },
  {
    duration: "300s",
    type: "Ready",
    status: "Unknown",
  },
];

export {
  removeUnhealthyCondition,
  setUnhealthyCondition,
  validateNumUnhealthyConditions,
  addUnhealthyCondition,
  setDuration,
  setStatus,
  setType,
  validateUnhealthyConditions,
  clickAddUnhealthyCondition,
  validateStatusDisabled,
};
