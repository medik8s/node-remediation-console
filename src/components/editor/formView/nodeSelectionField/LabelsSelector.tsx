import { SelectProps } from "@patternfly/react-core";
import { NodeKind } from "copiedFromConsole/types/node";
import { MultiSelectOption } from "copiedFromConsole/formik-fields/field-types";
import { useField } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as _ from "lodash";
import * as React from "react";
import { getObjectLabelDisplayNames } from "data/nodeSelector";
import MultiSelectField from "components/shared/MultiSelectField";

const LabelsSelector: React.FC<{
  nodes: NodeKind[];
  formViewFieldName: string;
  fieldName;
}> = ({ nodes, formViewFieldName, fieldName }) => {
  const [{ value }, , { setValue }] = useField<string[]>(fieldName);

  const { t } = useNodeHealthCheckTranslation();

  const onSelect: SelectProps["onSelect"] = (event, selection) => {
    // already selected
    const selected = value;
    let selectionValue: string;
    if (typeof selection === "string") {
      selectionValue = selection;
    } else {
      selectionValue = selection.toString();
    }
    let newValue;
    if (selected.includes(selectionValue)) {
      newValue = selected.filter((sel: string) => sel !== selectionValue);
    } else {
      newValue = [...value, selectionValue];
    }
    setValue(newValue);
  };

  const nodeLabelOptions: string[] = Array.from(
    new Set(
      _.flatten(nodes.map((object) => getObjectLabelDisplayNames(object)))
    )
  );
  nodeLabelOptions.sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true });
  });

  const multiSelectOptions = nodeLabelOptions.map<MultiSelectOption>(
    (value) => {
      const ret: MultiSelectOption = {
        isLastOptionBeforeFooter: (index: number): boolean =>
          index === value.length,
        id: value,
        value: value,
        displayName: value,
      };
      return ret;
    }
  );

  return (
    <MultiSelectField
      data-test="label-selector"
      name={fieldName}
      label={t("Nodes selection")}
      helpText={t(
        "Use labels to select the nodes you want to remediate. Leaving this field empty will select all nodes of the cluster."
      )}
      options={multiSelectOptions}
      onSelect={onSelect}
      enableClear={true}
    />
  );
};

export default LabelsSelector;
