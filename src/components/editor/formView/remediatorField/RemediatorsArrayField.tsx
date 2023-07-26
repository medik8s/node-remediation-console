import {
  Button,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { PlusIcon } from "@patternfly/react-icons";
import { FieldArray, FieldArrayRenderProps, useField } from "formik";
import * as React from "react";
import { getEmptyRemediationTemplate } from "../../../../data/remediator";
import {
  Remediator,
  RemediatorRadioOption,
  SnrTemplateResult,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import RemediatorField from "./RemediatorField";
import { DragDrop, Draggable, Droppable } from "@patternfly/react-core";
import { WithRemoveButton } from "../../../shared/WithRemoveButton";
import { GripVerticalIcon } from "@patternfly/react-icons";
import { InputField, NumberSpinnerField } from "formik-pf";

const SingleRemediatorField = ({
  snrTemplateResult,
  index,
  remove,
  fieldName,
  onOrderChanged,
  isExpanded,
  toggleExpand,
}: {
  snrTemplateResult: SnrTemplateResult;
  remove: (index: number) => void;
  index: number;
  fieldName: string;
  onOrderChanged: () => void;
  isExpanded: boolean;
  toggleExpand: (index: number) => void;
}) => {
  const [{ value: remediator }] = useField<Remediator>(fieldName);
  const { t } = useNodeHealthCheckTranslation();
  React.useEffect(() => {
    onOrderChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remediator.order]);
  return (
    <>
      <StackItem>
        <WithRemoveButton
          onClick={() => remove(index)}
          isDisabled={index === 0}
          dataTest={"remove-remediator-button"}
        >
          <Flex alignItems={{ default: "alignItemsFlexStart" }}>
            <FlexItem
              spacer={{ default: "spacerSm" }}
              className="pf-c-expandable-section"
            >
              <Button
                icon={<GripVerticalIcon />}
                style={{
                  padding:
                    "var(--pf-c-expandable-section__toggle--PaddingTop) 0 var(--pf-c-expandable-section__toggle--PaddingBottom) 0",
                }}
                variant="plain"
              />
            </FlexItem>
            <FlexItem>
              <ExpandableSection
                toggleContent={remediator?.template?.name || t("Enter a name")}
                isIndented
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(index)}
              >
                <RemediatorField
                  fieldName={`${fieldName}`}
                  snrTemplate={snrTemplateResult[0]}
                />
                <InputField
                  name={`${fieldName}.timeout`}
                  label={t("Timeout")}
                />
                <NumberSpinnerField
                  name={`${fieldName}.order`}
                  label={t("Order")}
                />
              </ExpandableSection>
            </FlexItem>
          </Flex>
        </WithRemoveButton>
      </StackItem>
      <StackItem>
        <Divider />
      </StackItem>
    </>
  );
};

interface SourceType {
  droppableId: string;
  index: number;
}
type DestinationType = SourceType;

const reorder = (list: Remediator[], startIndex: number, endIndex: number) => {
  const result = list;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const getExpanded = (
  size: number,
  expandLast?: boolean
): Record<number, boolean> => {
  const ret: Record<number, boolean> = {};
  for (let i = 0; i < size; ++i) {
    ret[i] = false;
  }
  if (expandLast) {
    ret[size - 1] = true;
  }
  return ret;
};

const RemediatorsArrayFieldContent = ({
  push,
  remove,
  snrTemplateResult,
  fieldName,
}: FieldArrayRenderProps & {
  snrTemplateResult: SnrTemplateResult;
  fieldName: string;
}) => {
  const [{ value: remediators }, , { setValue: setRemediators }] =
    useField<Remediator[]>(fieldName);
  const { t } = useNodeHealthCheckTranslation();

  const [expanded, setExpanded] = React.useState<Record<number, boolean>>(
    getExpanded(remediators?.length || 0, remediators?.length === 1)
  );

  const onDrop = (source: SourceType, dest: DestinationType) => {
    if (dest) {
      const newItems = reorder(remediators, source.index, dest.index).map(
        (r, idx) => ({ ...r, order: idx })
      );
      setRemediators(newItems);
      return true;
    }
    return false;
  };

  const onAdd = () => {
    const prevRemediatorOrder = remediators[remediators.length - 1]?.order;
    const newRemediator: Remediator = {
      radioOption: RemediatorRadioOption.CUSTOM,
      template: getEmptyRemediationTemplate(),
      order: prevRemediatorOrder ? prevRemediatorOrder + 1 : remediators.length,
    };
    setExpanded(getExpanded(remediators.length + 1, true));
    push(newRemediator);
  };

  return (
    <>
      <DragDrop onDrop={onDrop}>
        <Droppable>
          <Stack hasGutter>
            {(remediators || []).map(
              (_remediator: Remediator, index: number) => (
                <Draggable key={index}>
                  <SingleRemediatorField
                    key={index}
                    index={index}
                    remove={remove}
                    snrTemplateResult={snrTemplateResult}
                    fieldName={`${fieldName}[${index}]`}
                    onOrderChanged={() =>
                      setRemediators(
                        remediators.sort(
                          (remediator1, remediator2) =>
                            remediator1.order - remediator2.order
                        )
                      )
                    }
                    isExpanded={expanded[index]}
                    toggleExpand={(idx) =>
                      setExpanded({ ...expanded, [idx]: !expanded[idx] })
                    }
                  />
                </Draggable>
              )
            )}
          </Stack>
        </Droppable>
      </DragDrop>
      <Button
        isInline
        variant="link"
        onClick={onAdd}
        data-testid="add-remediator-button"
        icon={<PlusIcon />}
      >
        {t("Add more")}
      </Button>
    </>
  );
};

const RemediatorsArrayField = ({
  snrTemplateResult,
}: {
  snrTemplateResult: SnrTemplateResult;
}) => {
  const fieldName = "formData.escalatingRemediators";
  return (
    <FieldArray name={fieldName} validateOnChange={false}>
      {(props) => {
        return (
          <RemediatorsArrayFieldContent
            fieldName={fieldName}
            snrTemplateResult={snrTemplateResult}
            {...props}
          />
        );
      }}
    </FieldArray>
  );
};

export default RemediatorsArrayField;
