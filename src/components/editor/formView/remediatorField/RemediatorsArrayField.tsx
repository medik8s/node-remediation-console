import {
  Button,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  FormGroup,
  Label,
  Stack,
  StackItem,
} from "@patternfly/react-core";

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
import { GripVerticalIcon, InfoCircleIcon } from "@patternfly/react-icons";
import { InputField, NumberSpinnerField } from "formik-pf";
import { getDurationHelptext } from "../../../../copiedFromConsole/utils/durationUtils";
import HelpIcon from "../../../shared/HelpIcon";
import AddMoreButton from "../../../shared/AddMoreButton";

const ToggleContent = ({
  fieldName,
  isExpanded,
}: {
  fieldName: string;
  isExpanded: boolean;
}) => {
  const [{ value }, { error }] = useField<Remediator>(fieldName);
  const { t } = useNodeHealthCheckTranslation();
  return (
    <Flex>
      <FlexItem>
        {value?.template?.name
          ? value?.template?.name
          : t("Name of remediation template")}
      </FlexItem>
      {error && !isExpanded && (
        <FlexItem>
          <Label color="red" icon={<InfoCircleIcon />}>
            {t("Missing information")}
          </Label>
        </FlexItem>
      )}
    </Flex>
  );
};

const TimeoutField = ({ fieldName }: { fieldName: string }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <InputField
      name={fieldName}
      label={t("Timeout")}
      isRequired
      helperText={getDurationHelptext(t)}
      labelIcon={
        <HelpIcon
          helpText={t(
            "The timeout field determines when the next remediation template is invoked."
          )}
        />
      }
    />
  );
};

const OrderField = ({ fieldName }: { fieldName: string }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    //WORKAROUND: Adding formgroup as separate element since NumberSpinnerField ignores formgroup attributes
    <>
      <FormGroup
        isRequired
        name={fieldName}
        label={t("Order")}
        labelIcon={
          <HelpIcon
            helpText={t(
              "The order field determines the order in which the remediations are invoked. The lower order number is invoked earlier."
            )}
          />
        }
        fieldId={fieldName}
      />
      <NumberSpinnerField name={fieldName} />
    </>
  );
};

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
  return (
    <Stack hasGutter>
      <StackItem>
        <WithRemoveButton
          onClick={() => remove(index)}
          isDisabled={index === 0}
          dataTest={"remove-remediator-button"}
        >
          <Flex
            alignItems={{ default: "alignItemsFlexStart" }}
            flexWrap={{ default: "nowrap" }}
          >
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
            <FlexItem grow={{ default: "grow" }}>
              <ExpandableSection
                toggleContent={
                  <ToggleContent
                    fieldName={fieldName}
                    isExpanded={isExpanded}
                  />
                }
                isIndented
                isExpanded={isExpanded}
                onToggle={() => toggleExpand(index)}
              >
                <Stack hasGutter>
                  <StackItem>
                    <RemediatorField
                      fieldName={`${fieldName}`}
                      snrTemplate={snrTemplateResult[0]}
                    />
                  </StackItem>
                  <StackItem>
                    <TimeoutField fieldName={`${fieldName}.timeout`} />
                  </StackItem>
                  <StackItem>
                    <OrderField fieldName={`${fieldName}.order`} />
                  </StackItem>
                </Stack>
              </ExpandableSection>
            </FlexItem>
          </Flex>
        </WithRemoveButton>
      </StackItem>
      <StackItem>
        <Divider />
      </StackItem>
    </Stack>
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

  // const debouncedOnOrderChange = React.useMemo(
  //   () =>
  //     debounce(
  //       () =>
  //         setRemediators(
  //           remediators.sort(
  //             (remediator1, remediator2) =>
  //               remediator1.order - remediator2.order
  //           )
  //         ),
  //       500
  //     ),
  //   [remediators, setRemediators]
  // );

  return (
    <Stack hasGutter>
      <StackItem>
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
                      onOrderChanged={() => console.log("order changed")}
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
      </StackItem>
      <StackItem>
        <AddMoreButton onClick={onAdd} dataTest="add-remediator-button">
          {t("Add more")}
        </AddMoreButton>
      </StackItem>
    </Stack>
  );
};

const RemediatorsArrayField = ({
  snrTemplateResult,
}: {
  snrTemplateResult: SnrTemplateResult;
}) => {
  const fieldName = "formData.escalatingRemediations";
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
