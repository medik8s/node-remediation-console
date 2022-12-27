import { FormGroup, Skeleton, Tooltip } from "@patternfly/react-core";
import useSnrTemplate from "apis/useSNRTemplate";
import HelpIcon from "components/shared/HelpIcon";
import { withFallback } from "copiedFromConsole/error";
import { getFieldId } from "copiedFromConsole/formik-fields/field-utils";
import RadioButtonField from "copiedFromConsole/formik-fields/RadioButtonField";
import { getEmptyRemediationTemplate, getSNRLabel } from "data/remediator";
import { Remediator, RemediatorRadioOption } from "data/types";
import { useField } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";

import {
  getRemediatorFieldName,
  getRemediatorRadioOptionFieldName,
} from "../remediatorFieldUtils";

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
    <FormGroup fieldId={fieldId} label={"Remedatior"} isInline={true}>
      <Tooltip
        content={t(
          "Self node remediation is disabled because it's templates can't be found. Please reinstall the Self Node Remediation Operator."
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
  formViewFieldName,
}: {
  formViewFieldName: string;
}) => {
  const [snrTemplate, loaded] = useSnrTemplate();
  const [, , { setValue: setRemediator }] = useField<Remediator>(
    getRemediatorFieldName(formViewFieldName)
  );

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
      fieldName={getRemediatorRadioOptionFieldName(formViewFieldName)}
      onChange={onChange}
      snrTemplatesExist={!!snrTemplate}
    ></RemediatorKindRadioGroup>
  );
};

const RemediatorKindField = withFallback(RemediatorKindField_);

export default RemediatorKindField;
