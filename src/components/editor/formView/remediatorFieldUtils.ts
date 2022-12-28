import { getObjectItemFieldName } from "components/shared/formik-utils";
import { RemediatorRadioOption } from "data/types";
import { useField } from "formik";

const REMEDIATOR_FIELD_NAME = "remediator";

export const getRemediatorRadioOptionFieldName = (
  formViewFieldName: string
) => {
  return getObjectItemFieldName([
    formViewFieldName,
    REMEDIATOR_FIELD_NAME,
    "radioOption",
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
  const [{ value: remediatorKind }] = useField<RemediatorRadioOption>(
    getRemediatorRadioOptionFieldName(formViewFieldName)
  );
  return remediatorKind === RemediatorRadioOption.SNR;
};
