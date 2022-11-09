export type SNRRemediatorStrategy = "Node deletion" | "Resource deletion";
const nameSelector = "[data-test=NodeHealthCheck-name]";

const setName = (name: string) => {
  cy.get(nameSelector).type(name);
};

const setMinHealthy = (minValue: string) => {
  cy.get("[data-test=min-healthy]").clear();
  cy.get("[data-test=min-healthy]").type(minValue);
};

const validateName = (name) => {
  cy.get(nameSelector).should("have.value", name);
};

const create = () => {
  cy.get("[data-test=save-changes]").click();
};

const validateInEditor = () => {
  cy.get("[data-test=synced-editor-field]", { timeout: 120000 }).should(
    "exist"
  );
};

const validatePluginLoaded = () => {
  cy.get("[data-test=synced-editor-field]", { timeout: 120000 }).should(
    "exist"
  );
};

export {
  setName,
  validateName,
  create,
  validateInEditor,
  setMinHealthy,
  validatePluginLoaded,
};
