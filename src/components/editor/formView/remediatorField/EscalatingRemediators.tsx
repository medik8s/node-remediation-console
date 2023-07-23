import {
  Field,
  FieldArray,
  FieldArrayRenderProps,
  useFormikContext,
} from "formik";
import * as React from "react";
import { useTranslation } from "react-i18next";
import RemediatorField from "./RemediatorField";

const RemediatorsArrayFieldContent = ({ push, pop }: FieldArrayRenderProps) => {
  const { t } = useTranslation();
  return (
  );
};

const RemediatorsArrayField = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<RemediatorFieldValues>();
  const { remediator } = values;
  const { escalating } = remediator;

  return (
    <FieldArray
      name="remediators"
      validateOnChange={false}
      component={RemediatorsArrayFieldContent}
    />
  );
};
