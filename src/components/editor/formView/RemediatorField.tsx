import * as React from "react";
import * as _ from "lodash";
import RadioGroupField from "components/copiedFromConsole/formik-fields/RadioGroupField";
import { getObjectItemFieldName } from "components/shared/formik-utils";
import {
  BuiltInRemediationTemplate,
  FormDataRemediator,
  RemediatorKind,
} from "data/types";
import { FormViewFieldProps } from "./propTypes";
import InputField from "components/shared/InputField";
import { useField } from "formik";
import { getRemediatorLabel } from "data/remediatorFormData";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import {
  getRemediatorKindFieldName,
  getRemediatorTemplateFieldName,
  useIsSNR,
} from "./remediatorFieldUtils";
import DropdownField from "components/shared/DropdownField";

const RadioGroupOptions = [
  {
    value: RemediatorKind.SNR,
    label: getRemediatorLabel(RemediatorKind.SNR),
  },
  {
    value: RemediatorKind.CUSTOM,
    label: getRemediatorLabel(RemediatorKind.CUSTOM),
  },
];

const SNRStrategyOptions = [
  {
    label: "Resource deletion",
    value: BuiltInRemediationTemplate.ResourceDeletion,
  },
  {
    label: "Node deletion",
    value: BuiltInRemediationTemplate.NodeDeletion,
  },
];

const sentenceCase = (string: string) => {
  return _.capitalize(_.startCase(string));
};

const RemediatorKindGroup = ({
  fieldName,
  templateFieldName,
}: FormViewFieldProps & { templateFieldName: string }) => {
  const [, , { setValue: setKind }] =
    useField<FormDataRemediator["kind"]>(fieldName);
  const [, , { setValue: setRemediationTemplate }] =
    useField<FormDataRemediator["template"]>(templateFieldName);
  const onChange = (kind: RemediatorKind) => {
    setKind(kind);
    if (kind === RemediatorKind.CUSTOM) {
      setRemediationTemplate({
        apiVersion: "",
        kind: "",
        namespace: "",
        name: "",
      });
    } else {
      setRemediationTemplate(BuiltInRemediationTemplate.ResourceDeletion);
    }
  };
  return (
    <RadioGroupField
      options={RadioGroupOptions}
      name={fieldName}
      isInline
      onChange={onChange}
      label="Remedatior"
    ></RadioGroupField>
  );
};

const SNRRemediatorField = ({ fieldName }: FormViewFieldProps) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <DropdownField
      name={fieldName}
      label={t("Remediation Strategy")}
      isRequired
      items={SNRStrategyOptions}
    ></DropdownField>
  );
};

const CustomRemediatorField = ({ fieldName }: FormViewFieldProps) => (
  <>
    {["apiVersion", "kind", "name", "namespace"].map((subFieldName) => {
      const inputFieldName = getObjectItemFieldName([fieldName, subFieldName]);
      return (
        <InputField
          required
          name={inputFieldName}
          key={inputFieldName}
          label={sentenceCase(subFieldName)}
        ></InputField>
      );
    })}
  </>
);

export const RemediatorField: React.FC<{ formViewFieldName: string }> = ({
  formViewFieldName,
}) => {
  const kindFieldName = getRemediatorKindFieldName(formViewFieldName);
  const templateFieldName = getRemediatorTemplateFieldName(formViewFieldName);
  const isSNR = useIsSNR(formViewFieldName);
  return (
    <>
      <RemediatorKindGroup
        fieldName={kindFieldName}
        templateFieldName={templateFieldName}
      />
      {isSNR && (
        <SNRRemediatorField fieldName={templateFieldName}></SNRRemediatorField>
      )}
      {!isSNR && (
        <CustomRemediatorField
          fieldName={templateFieldName}
        ></CustomRemediatorField>
      )}
    </>
  );
};
