import { FormGroup, Split, SplitItem, Tooltip } from "@patternfly/react-core";

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
  RemediationTemplate,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";

const RemediatorKindRadioGroup: React.FC<{
  snrTemplatesExist: boolean;
  fieldName: string;
  onChange: (kind: RemediatorRadioOption) => void;
}> = ({ snrTemplatesExist, fieldName, onChange }) => {
  const { t } = useNodeHealthCheckTranslation();
  const fieldId = getFieldId(fieldName, "radiogroup");
  return (
    <FormGroup
      fieldId={fieldId}
      label={t("Remediation template")}
      isInline={true}
    >
      <Split hasGutter>
        <SplitItem>
          <Tooltip
            content={t(
              "Self node remediation is disabled because its templates can't be found. Please reinstall the Self Node Remediation Operator."
            )}
            hidden={snrTemplatesExist}
          >
            <RadioButtonField
              value={RemediatorRadioOption.SNR}
              label={getSNRLabel(t)}
              isDisabled={!snrTemplatesExist}
              aria-describedby={"SNR remediator kind"}
              name={fieldName}
              onChange={onChange}
            />
          </Tooltip>
        </SplitItem>
        <SplitItem>
          <RadioButtonField
            value={RemediatorRadioOption.CUSTOM}
            label={t("Other")}
            aria-describedby={"CUSTOM remediator kind"}
            name={fieldName}
            onChange={onChange}
          />
        </SplitItem>
      </Split>
    </FormGroup>
  );
};

const RemediatorKindField_ = ({
  fieldName,
  snrTemplate,
}: {
  fieldName: string;
  snrTemplate: RemediationTemplate | undefined;
}) => {
  const [{ value }, , { setValue: setRemediator }] =
    useField<Remediator>(fieldName);

  const setCustomRemediator = () => {
    setRemediator({
      ...value,
      radioOption: RemediatorRadioOption.CUSTOM,
      template: getEmptyRemediationTemplate(),
    });
  };

  const onChange = (kind: RemediatorRadioOption) => {
    if (kind === RemediatorRadioOption.CUSTOM) {
      setCustomRemediator();
    } else {
      setRemediator({
        ...value,
        radioOption: RemediatorRadioOption.SNR,
        template: snrTemplate,
      });
    }
  };

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
