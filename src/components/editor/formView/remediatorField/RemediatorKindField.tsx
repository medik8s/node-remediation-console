import { FormGroup, Tooltip } from "@patternfly/react-core";
import { withFallback } from "copiedFromConsole/error";
import { getFieldId } from "copiedFromConsole/formik-fields/field-utils";
import RadioButtonField from "copiedFromConsole/formik-fields/RadioButtonField";
import {
  Remediator,
  RemediatorLabel,
  BuiltInRemediationTemplate,
  RemediationTemplate,
} from "data/types";
import { useField } from "formik";
import * as React from "react";
import {
  getRemediatorFieldName,
  getRemediatorKindFieldName,
} from "../remediatorFieldUtils";

const RemediatorKindRadioGroup: React.FC<{
  snrTemplatesExist: boolean;
  fieldName: string;
  onChange: (kind: RemediatorLabel) => void;
}> = ({ snrTemplatesExist, fieldName, onChange }) => {
  const fieldId = getFieldId(fieldName, "radiogroup");
  return (
    <FormGroup fieldId={fieldId} label={"Remedatior"} isInline={true}>
      <Tooltip
        content={
          "Self node remediation is disabled because it's templates can't be found. Please reinstall the Self Node Remediation Operator."
        }
        hidden={snrTemplatesExist}
      >
        <RadioButtonField
          value={RemediatorLabel.SNR}
          label={RemediatorLabel.SNR}
          isDisabled={!snrTemplatesExist}
          aria-describedby={"SNR remediator kind"}
          name={fieldName}
          onChange={onChange}
        />
      </Tooltip>
      <RadioButtonField
        value={RemediatorLabel.CUSTOM}
        label={RemediatorLabel.CUSTOM}
        aria-describedby={"CUSTOM remediator kind"}
        name={fieldName}
        onChange={onChange}
      />
    </FormGroup>
  );
};

const getEmptyRemediationTemplate = (): RemediationTemplate => ({
  apiVersion: "",
  kind: "",
  name: "",
  namespace: "",
});

const RemediatorKindField_ = ({
  formViewFieldName,
  snrTemplatesExist,
}: {
  formViewFieldName: string;
  snrTemplatesExist: boolean;
}) => {
  const [, , { setValue: setRemediator }] = useField<Remediator>(
    getRemediatorFieldName(formViewFieldName)
  );

  const setCustomRemediator = () => {
    setRemediator({
      label: RemediatorLabel.CUSTOM,
      template: getEmptyRemediationTemplate(),
    });
  };

  React.useEffect(() => {
    if (!snrTemplatesExist) {
      setCustomRemediator();
    }
  }, []);

  const onChange = (kind: RemediatorLabel) => {
    if (kind === RemediatorLabel.CUSTOM) {
      setCustomRemediator();
    } else {
      setRemediator({
        label: kind,
        template: BuiltInRemediationTemplate.NodeDeletion,
      });
    }
  };
  return (
    <RemediatorKindRadioGroup
      fieldName={getRemediatorKindFieldName(formViewFieldName)}
      onChange={onChange}
      snrTemplatesExist={snrTemplatesExist}
    ></RemediatorKindRadioGroup>
  );
};

const RemediatorKindField = withFallback(RemediatorKindField_);

export default RemediatorKindField;
