import { getObjectItemFieldName } from "components/shared/formik-utils";
import { RemediatorLabel } from "data/types";
import { useField } from "formik";

const REMEDIATOR_FIELD_NAME = "remediator";

export const getRemediatorKindFieldName = (formViewFieldName: string) => {
  return getObjectItemFieldName([
    formViewFieldName,
    REMEDIATOR_FIELD_NAME,
    "label",
  ]);
};

export const getRemediatorTemplateFieldName = (formViewFieldName: string) => {
  return getObjectItemFieldName([
    formViewFieldName,
    REMEDIATOR_FIELD_NAME,
    "template",
  ]);
};

export const getRemediatorFieldName = (formViewFieldName: string) =>
  getObjectItemFieldName([formViewFieldName, REMEDIATOR_FIELD_NAME]);

export const useIsSNR = (formViewFieldName): boolean => {
  const [{ value: remediatorKind }] = useField<RemediatorLabel>(
    getRemediatorKindFieldName(formViewFieldName)
  );
  return remediatorKind === RemediatorLabel.SNR;
};
