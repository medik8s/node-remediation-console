import {
  Button,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  Label,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import { FieldArray, FieldArrayRenderProps, useField } from "formik";
import * as React from "react";
import {
  getEmptyRemediationTemplate,
  getSortedRemediators,
} from "../../../../data/remediator";
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
import { getDurationHelptext } from "../../../../copiedFromConsole/utils/durationUtils";
import HelpIcon from "../../../shared/HelpIcon";
import AddMoreButton from "../../../shared/AddMoreButton";
import NumberSpinnerField from "../../../shared/NumberSpinnerField";
import { useDebounce } from "../../../../copiedFromConsole/hooks/useDebounce";
import InputField from "../../../../copiedFromConsole/formik-fields/InputField";
import { isEqual } from "lodash-es";

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
    <Flex alignItems={{ default: "alignItemsFlexStart" }}>
      <FlexItem>
        {value?.template?.name
          ? value?.template?.name
          : t("Name of remediation template")}
      </FlexItem>
      {error && !isExpanded && (
        <FlexItem>
          <Label color="red" icon={<InfoCircleIcon />} variant="outline">
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
      required
      helpText={getDurationHelptext(t)}
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

const OrderField = ({
  fieldName,
  onChange,
}: {
  fieldName: string;
  onChange: () => void;
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <NumberSpinnerField
      name={fieldName}
      required
      label={t("Order")}
      labelIcon={
        <HelpIcon
          helpText={t(
            "The order field determines the order in which the remediations are invoked. The lower order number is invoked earlier."
          )}
        />
      }
      onBlur={onChange}
    />
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
  isRemoveDisabled,
}: {
  snrTemplateResult: SnrTemplateResult;
  remove: (index: number) => void;
  index: number;
  fieldName: string;
  onOrderChanged: () => void;
  isExpanded: boolean;
  toggleExpand: (index: number) => void;
  isRemoveDisabled: boolean;
}) => {
  return (
    <Stack hasGutter>
      <StackItem>
        <WithRemoveButton
          onClick={() => remove(index)}
          isDisabled={isRemoveDisabled}
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
                    <OrderField
                      fieldName={`${fieldName}.order`}
                      onChange={onOrderChanged}
                    />
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
  remediators: Remediator[],
  expandLast?: boolean
): Record<number, boolean> => {
  const ret: Record<number, boolean> = {};
  for (let i = 0; i < remediators.length; ++i) {
    ret[remediators[i].id] = false;
  }
  if (expandLast) {
    ret[remediators[remediators.length - 1].id] = true;
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
    getExpanded(remediators || [], remediators?.length === 1)
  );

  const onOrderFieldChange = (id: number) => {
    const newRemediators = getSortedRemediators(remediators);
    if (!isEqual(newRemediators, remediators)) {
      setRemediators(getSortedRemediators(remediators));
      setExpanded({ ...getExpanded(remediators), [id]: true });
    }
  };

  const debounce = useDebounce(onOrderFieldChange, 300);

  const onDrop = (source: SourceType, dest: DestinationType) => {
    debounce.cancel();
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
      order: (prevRemediatorOrder || 0) + 1,
      id: Math.random(),
    };
    setExpanded(getExpanded([...remediators, newRemediator], true));
    push(newRemediator);
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <DragDrop onDrop={onDrop}>
          <Droppable>
            <Stack hasGutter>
              {remediators?.map((_remediator, index) => (
                <Draggable key={index}>
                  <SingleRemediatorField
                    key={_remediator.id}
                    index={index}
                    remove={remove}
                    snrTemplateResult={snrTemplateResult}
                    fieldName={`${fieldName}[${index}]`}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    onOrderChanged={() => debounce(_remediator.id)}
                    isExpanded={expanded[_remediator.id]}
                    toggleExpand={() =>
                      setExpanded({
                        ...expanded,
                        [_remediator.id]: !expanded[_remediator.id],
                      })
                    }
                    isRemoveDisabled={remediators.length === 1}
                  />
                </Draggable>
              ))}
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
