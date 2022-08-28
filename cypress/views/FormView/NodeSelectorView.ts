const labelSelector = '[data-test="multi-select-Nodes selection"]';

const addLabelToNodeSelector = (labelKey: string, labelValue: string) => {
  const str = `${labelKey}=${labelValue}`;
  cy.get(`${labelSelector} input`).type(str);
  cy.get(`${labelSelector} .pf-c-select__menu-item`).contains(str).click();
};

const validateNodeSelectorLabel = (labelKey: string, labelValue?: string) => {
  if (labelValue) {
    cy.get(labelSelector).contains(`${labelKey}=${labelValue}`).should("exist");
  } else {
    cy.get(labelSelector).contains(labelKey).should("exist");
  }
};

const validateNodes = (nodeNames: string[]) => {
  cy.get("[data-test=node-selector-list] .co-resource-item__resource-name")
    .should("have.length", nodeNames.length)
    .each((cell, index) => {
      expect(cell.text()).to.equal(nodeNames[index]);
    });
};

export { validateNodeSelectorLabel, validateNodes, addLabelToNodeSelector };
