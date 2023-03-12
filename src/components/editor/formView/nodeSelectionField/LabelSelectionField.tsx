import {
  Chip,
  ChipGroup,
  Flex,
  FlexItem,
  Stack,
  StackItem,
  SelectGroup,
  SelectOption,
} from "@patternfly/react-core";
import { NodeKind } from "copiedFromConsole/types/node";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import { uniq, flatten } from "lodash-es";
import useDeepCompareMemoize from "hooks/useDeepCompareMemoize";
import { useField } from "formik";
import MultiSelectField from "components/shared/MultiSelectField";
import { intersection } from "lodash-es";
import { ClusterRoleLabels, getClusterRoleLabels, Role } from "data/nodeRoles";

const stringifyNodeLabels = (node: NodeKind): string[] => {
  if (!node.metadata?.labels) {
    return [];
  }
  return Object.entries(node.metadata.labels).map(([key, value]) =>
    value ? `${key}=${value}` : key
  );
};

const getAllNodesLabels = (allNodes: NodeKind[]): string[] =>
  uniq(flatten(allNodes.map((node) => stringifyNodeLabels(node)))).sort();

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

  const [roleLabels, setRoleLabels] = React.useState<ClusterRoleLabels>({});
  const [selectGroups, setSelectGroups] = React.useState<JSX.Element[]>([]);
  const memoValue = useDeepCompareMemoize<string[]>(field.value);
  const [allLabels, setAllLabels] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!isLoading) {
      let _options = uniq(
        flatten(allNodes.map((node) => stringifyNodeLabels(node)))
      );
      //add value to options, needed for complex match expressions or labels that aren't currently on the nodes
      //include previous options to not remove original match expressions
      _options = uniq([...memoValue, ...allLabels, ..._options]).sort();
      const _selectGroups = [];
      const _roleLabels = getClusterRoleLabels(allNodes);
      if (Object.keys(_roleLabels).length === 2) {
        _selectGroups.push(
          <SelectGroup label={t("Role")}>
            <SelectOption value={_roleLabels[Role.CONTROL_PLANE]}>
              {t("Control plane")}
            </SelectOption>
            <SelectOption value={_roleLabels[Role.WORKER]}>
              {t("Worker")}
            </SelectOption>
          </SelectGroup>
        );
      }
      _selectGroups.push(
        <SelectGroup label={t("Label")}>
          {getAllNodesLabels(allNodes).map((option) => (
            <SelectOption value={option}>{option}</SelectOption>
          ))}
        </SelectGroup>
      );
      setSelectGroups(_selectGroups);
      setRoleLabels(_roleLabels);
      setAllLabels(_options);
    }
  }, [memoValue, isLoading]); // doesn't respond to allNodes, it can change every second

  const getSelectedRoleLabels = () =>
    intersection(field.value, Object.values(roleLabels));

  const onDeleteLabel = (label: string) => {
    setValue(field.value.filter((curLabel) => curLabel !== label));
  };

  return (
    <Stack hasGutter>
      <StackItem style={{ marginBottom: "var(--pf-global--spacer--sm)" }}>
        <MultiSelectField
          options={selectGroups}
          enableClear={true}
          isLoading={isLoading}
          name={fieldName}
          label={t("Nodes selection")}
          helpText={t(
            "Select the labels that will be used to find unhealthy nodes for remediation. The nodes must satisfy all selected labels."
          )}
          isRequired={true}
        />
      </StackItem>
      {!isLoading && (
        <StackItem>
          <Flex flexWrap={{ default: "nowrap" }}>
            {getSelectedRoleLabels().length > 0 && (
              <FlexItem>
                <ChipGroup
                  key="roles"
                  categoryName={"Role"}
                  collapsedText={t("Show more")}
                  expandedText={t("Show less")}
                  defaultIsOpen={true}
                >
                  {getSelectedRoleLabels().map((label) => (
                    <Chip key={label} onClick={() => onDeleteLabel(label)}>
                      {label === roleLabels[Role.CONTROL_PLANE]
                        ? t("Control plane")
                        : t("Worker")}
                    </Chip>
                  ))}
                </ChipGroup>
              </FlexItem>
            )}
            <FlexItem>
              <ChipGroup
                key="labels"
                categoryName={"Labels"}
                collapsedText={t("Show more")}
                expandedText={t("Show less")}
                defaultIsOpen={true}
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
        </StackItem>
      )}
    </Stack>
  );
};

export default LabelSelectionField;
