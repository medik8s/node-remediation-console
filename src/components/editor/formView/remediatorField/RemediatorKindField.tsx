import { FormGroup, Skeleton, Tooltip } from "@patternfly/react-core";

import { useField } from "formik";

import * as React from "react";

import { withFallback } from "../../../../copiedFromConsole/error";
import { getFieldId } from "../../../../copiedFromConsole/formik-fields/field-utils";
import RadioButtonField from "../../../../copiedFromConsole/formik-fields/RadioButtonField";
import {
  getSNRLabel,
  getEmptyRemediationTemplate,
} from "../../../../data/remediator";
import {
  RemediatorRadioOption,
  Remediator,
  SnrTemplateResult,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import HelpIcon from "../../../shared/HelpIcon";

const SNRRadioButtonLabel: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <>
      {getSNRLabel(t)}
      <HelpIcon
        helpText={t(
          "Self node remediation template uses the remediation strategy 'Resource Deletion'."
        )}
      />
    </>
  );
};

const RemediatorKindRadioGroup: React.FC<{
  snrTemplatesExist: boolean;
  fieldName: string;
  onChange: (kind: RemediatorRadioOption) => void;
}> = ({ snrTemplatesExist, fieldName, onChange }) => {
  const { t } = useNodeHealthCheckTranslation();
  const fieldId = getFieldId(fieldName, "radiogroup");
  return (
    <FormGroup fieldId={fieldId} label={"Remediator"} isInline={true}>
      <Tooltip
        content={t(
          "Self node remediation is disabled because its templates can't be found. Please reinstall the Self Node Remediation Operator."
        )}
        hidden={snrTemplatesExist}
      >
        <RadioButtonField
          value={RemediatorRadioOption.SNR}
          label={<SNRRadioButtonLabel />}
          isDisabled={!snrTemplatesExist}
          aria-describedby={"SNR remediator kind"}
          name={fieldName}
          onChange={onChange}
        />
      </Tooltip>
      <RadioButtonField
        value={RemediatorRadioOption.CUSTOM}
        label={t("Other")}
        aria-describedby={"CUSTOM remediator kind"}
        name={fieldName}
        onChange={onChange}
      />
    </FormGroup>
  );
};

const RemediatorKindField_ = ({
  fieldName,
  snrTemplateResult,
}: {
  fieldName: string;
  snrTemplateResult: SnrTemplateResult;
}) => {
  const [snrTemplate, loaded] = snrTemplateResult;
  const [, , { setValue: setRemediator }] = useField<Remediator>(fieldName);

  const setCustomRemediator = () => {
    setRemediator({
      radioOption: RemediatorRadioOption.CUSTOM,
      template: getEmptyRemediationTemplate(),
    });
  };

  const onChange = (kind: RemediatorRadioOption) => {
    if (kind === RemediatorRadioOption.CUSTOM) {
      setCustomRemediator();
    } else {
      setRemediator({
        radioOption: RemediatorRadioOption.SNR,
        template: snrTemplate,
      });
    }
  };
  if (!loaded) {
    return <Skeleton />;
  }
  return (
    <RemediatorKindRadioGroup
      fieldName={`${fieldName}.radioOption`}
      onChange={onChange}
      snrTemplatesExist={!!snrTemplate}
    />
  );
};

const RemediatorKindField = withFallback(RemediatorKindField_);

export default RemediatorKindField;
