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
import { Remediator, SnrTemplateResult } from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import RemediatorField from "./RemediatorField";
import { DragDrop, Draggable, Droppable } from "@patternfly/react-core";
import { WithRemoveButton } from "../../../shared/WithRemoveButton";
import { GripVerticalIcon } from "@patternfly/react-icons";

const SingleRemediatorField = ({
  snrTemplateResult,
  index,
  remove,
  fieldName,
}: {
  snrTemplateResult: SnrTemplateResult;
  remove: (index: number) => void;
  index: number;
  fieldName: string;
}) => {
  const [{ value: remediator }] = useField<Remediator>(fieldName);
  const { t } = useNodeHealthCheckTranslation();

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
              >
                <RemediatorField
                  fieldName={fieldName}
                  snrTemplateResult={snrTemplateResult}
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
interface DestinationType extends SourceType {}

const reorder = (list: Remediator[], startIndex: number, endIndex: number) => {
  const result = list;
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const RemediatorsArrayFieldContent = ({
  push,
  remove,
  snrTemplateResult,
}: FieldArrayRenderProps & {
  snrTemplateResult: SnrTemplateResult;
}) => {
  const fieldName = "formData.remediators";
  const [{ value: remediators }, , { setValue: setRemediators }] =
    useField<Remediator[]>(fieldName);
  const { t } = useNodeHealthCheckTranslation();

  const onDrop = (source: SourceType, dest: DestinationType) => {
    if (dest) {
      const newItems = reorder(remediators, source.index, dest.index);
      setRemediators(newItems);
      return true;
    }
    return false;
  };

  return (
    <>
      <DragDrop onDrop={onDrop}>
        <Droppable>
          <Stack hasGutter>
            {remediators.map((_remediator: Remediator, index: number) => (
              <Draggable key={index}>
                <SingleRemediatorField
                  key={index}
                  index={index}
                  remove={remove}
                  snrTemplateResult={snrTemplateResult}
                  fieldName={`${fieldName}[${index}]`}
                />
              </Draggable>
            ))}
          </Stack>
        </Droppable>
      </DragDrop>
      <Button
        isInline
        variant="link"
        onClick={() => push(getEmptyRemediationTemplate())}
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
  return (
    <FieldArray name="formData.remediators" validateOnChange={false}>
      {(props) => {
        return (
          <RemediatorsArrayFieldContent
            snrTemplateResult={snrTemplateResult}
            {...props}
          />
        );
      }}
    </FieldArray>
  );
};

export default RemediatorsArrayField;
