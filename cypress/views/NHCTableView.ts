import { closePopover } from "./Shared";

type RowData = {
  name: string;
  remediator: string;
  status: string;
  statusReason: string;
};

const getRowSelector = (rowNum: number) => {
  return `[data-index=${rowNum}]`;
};

const getStatusElement = (rowSelector: string) =>
  cy.get(`${rowSelector} [data-test="nhc-status-label"]`);

const _validateStatus = (rowSelector: string, status: string) => {
  getStatusElement(rowSelector).contains(status).should("exist");
};

const validateName = (rowSelector: string, name: string) => {
  cy.get(`${rowSelector} [data-test-id=${name}]`).should("exist");
};

const validateTimestamp = (rowSelector: string) => {
  cy.get(`${rowSelector} [data-test=timestamp]`).should("exist");
};

const validateRemediator = (rowSelector: string, remediator: string) => {
  return cy
    .get(`${rowSelector} [data-test=remediator-label]`)
    .contains(remediator)
    .should("exist");
};

const validateStatusReason = (rowSelector: string, statusReason: string) => {
  getStatusElement(rowSelector).click();
  cy.get("[data-test=status-reason]").contains(statusReason).should("exist");
  closePopover();
};

const create = () => {
  cy.get("[data-test=item-create]").click();
};

const toggleKababMenu = (rowNum: number) => {
  cy.get(`${getRowSelector(rowNum)} [aria-label=Actions]`).click();
};

const validateRow = (
  rowNum: number,
  expectedRowData: {
    name: string;
    remediator: string;
    status: string;
    statusReason: string;
  }
) => {
  const rowSelector = getRowSelector(rowNum);
  validateName(rowSelector, expectedRowData.name);
  validateRemediator(rowSelector, expectedRowData.remediator);
  _validateStatus(rowSelector, expectedRowData.status);
  validateStatusReason(rowSelector, expectedRowData.statusReason);
  validateTimestamp(rowSelector);
};

const validateRows = (rows: RowData[]) => {
  for (let i = 0; i < rows.length; i++) {
    validateRow(i, rows[i]);
  }
  cy.get("[data-test-rows=resource-row]").should("have.length", rows.length);
};

const validateStatus = (rowNum: number, status: string) => {
  _validateStatus(getRowSelector(rowNum), status);
};

export { validateRow, create, validateRows, toggleKababMenu, validateStatus };
