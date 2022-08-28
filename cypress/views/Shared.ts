const selectFromDropdown = (
  dropdownToggleSelector: string,
  itemLabel: string
) => {
  cy.get(dropdownToggleSelector).click();
  cy.get("[role=menuitem]").contains(itemLabel).click();
};

const closePopover = () => {
  cy.get("[aria-label=Close]").click();
};

export { selectFromDropdown, closePopover };
