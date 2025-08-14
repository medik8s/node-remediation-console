import {
  Chip,
  ChipGroup,
  Flex,
  FlexItem,
  SelectGroup,
  SelectOption,
  SelectList,
} from "@patternfly/react-core";
import { NodeKind } from "copiedFromConsole/types/node";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import { uniq, flatten } from "lodash-es";
import { useField } from "formik";
import MultiSelectField from "components/shared/MultiSelectField";
import {
  getClusterRoleLabels,
  Role,
  getRoleTitle,
  getRoleLabel,
} from "data/nodeRoles";
import fuzzy from "fuzzysearch";

const stringifyNodeLabels = (node: NodeKind): string[] => {
  if (!node.metadata?.labels) {
    return [];
  }
  return Object.entries(node.metadata.labels).map(([key, value]) =>
    value ? `${key}=${value}` : key
  );
};

const LabelSelectionField = ({
  allNodes,
  isLoading,
  fieldName,
}: {
  isLoading: boolean;
  allNodes: NodeKind[];
  fieldName: string;
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [field, , { setValue }] = useField<string[]>(fieldName);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const { roleLabels, otherLabels, selectedRoleLabels } = React.useMemo(() => {
    // add previous selections too
    const nodeLabels = uniq([
      ...flatten(allNodes.map((node) => stringifyNodeLabels(node))),
      ...field.value,
    ]).sort();

    const filteredNodeLabels = nodeLabels.filter((l) => fuzzy(filterValue, l));
    const roleLabels = getClusterRoleLabels(t, filteredNodeLabels);

    const otherLabels = filteredNodeLabels.filter(
      (l) => !roleLabels.some(({ value }) => value === l)
    );

    const selectedRoleLabels = field.value.filter((l) =>
      roleLabels.some(({ value }) => value === l)
    );

    return { roleLabels, otherLabels, selectedRoleLabels };
  }, [isLoading, field.value, filterValue, t]);

  const onDeleteLabel = (label: string) => {
    setValue(field.value.filter((curLabel) => curLabel !== label));
  };

  return (
    <>
      <MultiSelectField
        isLoading={isLoading}
        name={fieldName}
        label={t("Selector labels")}
        helpText={t(
          "Select the labels that will be used to find unhealthy nodes for remediation. The nodes must satisfy all selected labels."
        )}
        isRequired
        filterValue={filterValue}
        setFilterValue={setFilterValue}
      >
        {!!roleLabels.length && (
          <SelectGroup label={t("Role")}>
            <SelectList>
              {roleLabels.map(({ title, value }) => (
                <SelectOption
                  key={value}
                  isSelected={field.value.includes(value)}
                  hasCheckbox
                  value={value}
                >
                  {title}
                </SelectOption>
              ))}
            </SelectList>
          </SelectGroup>
        )}
        <SelectGroup label={t("Labels")}>
          <SelectList>
            {otherLabels.map((label) => (
              <SelectOption
                key={label}
                isSelected={field.value.includes(label)}
                hasCheckbox
                value={label}
              >
                {label}
              </SelectOption>
            ))}
          </SelectList>
        </SelectGroup>
      </MultiSelectField>
      {!isLoading && (
        <Flex flexWrap={{ default: "nowrap" }}>
          {selectedRoleLabels.length > 0 && (
            <FlexItem>
              <ChipGroup
                key="roles"
                categoryName={t("Role")}
                collapsedText={t("Show more")}
                expandedText={t("Show less")}
                defaultIsOpen
              >
                {selectedRoleLabels.map((label) => (
                  <Chip key={label} onClick={() => onDeleteLabel(label)}>
                    {label === getRoleLabel(Role.WORKER)
                      ? getRoleTitle(t, Role.WORKER)
                      : getRoleTitle(t, Role.CONTROL_PLANE)}
                  </Chip>
                ))}
              </ChipGroup>
            </FlexItem>
          )}
          <FlexItem>
            <ChipGroup
              key="labels"
              categoryName={t("Labels")}
              collapsedText={t("Show more")}
              expandedText={t("Show less")}
              defaultIsOpen
              numChips={2}
            >
              {field.value.map((label) => (
                <Chip key={label} onClick={() => onDeleteLabel(label)}>
                  {label}
                </Chip>
              ))}
            </ChipGroup>
          </FlexItem>
        </Flex>
      )}
    </>
  );
};

export default LabelSelectionField;
