export const DeleteNHC = () => {
  cy.get("[data-test-id=delete]").click();
  cy.get("[data-test=confirm]").click();
};

export const PauseNHC = (reasons: string[]) => {
  cy.get("[data-test-id=pause]").click();
  for (let i = 0; i < reasons.length; ++i) {
    cy.get(`[data-test=pause-reason-input][data-index=${i}]`).type(reasons[i]);
    if (i < reasons.length - 1) {
      cy.get("[data-test=add-pause-reason]").click();
    }
  }
  cy.get("[data-test=confirm]").click();
};

export const UnpauseNHC = () => {
  cy.get("[data-test-id=unpause]").click();
  cy.get("[data-test=confirm]").click();
};

export const EditNHC = () => {
  cy.get("[data-test-id=edit]").click();
};
