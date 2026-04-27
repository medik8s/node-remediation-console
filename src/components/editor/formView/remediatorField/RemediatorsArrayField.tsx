import {
  Button,
  Divider,
  ExpandableSection,
  Flex,
  FlexItem,
  Label,
} from "@patternfly/react-core";
import type { DragEndEvent } from "@dnd-kit/core";
import { DragDropSort } from "@patternfly/react-drag-drop";
import type { DraggableObject } from "@patternfly/react-drag-drop/dist/esm/components/DragDrop/DragDropContainer";

import { FieldArray, FieldArrayRenderProps, useField } from "formik";
import * as React from "react";
import {
  getEmptyRemediationTemplate,
  getSortedRemediators,
} from "../../../../data/remediator";
import { Remediator } from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import RemediatorField from "./RemediatorField";
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
            "The timeout field determines when the next remediation template is invoked.",
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
            "The order field determines the order in which the remediations are invoked. The lower order number is invoked earlier.",
          )}
        />
      }
      onBlur={onChange}
    />
  );
};

const SingleRemediatorField = ({
  index,
  remove,
  fieldName,
  onOrderChanged,
  isExpanded,
  toggleExpand,
  isRemoveDisabled,
}: {
  remove: (index: number) => void;
  index: number;
  fieldName: string;
  onOrderChanged: () => void;
  isExpanded: boolean;
  toggleExpand: (index: number) => void;
  isRemoveDisabled: boolean;
}) => {
  return (
    <>
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
            className="pf-v6-c-expandable-section"
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
                <ToggleContent fieldName={fieldName} isExpanded={isExpanded} />
              }
              isIndented
              isExpanded={isExpanded}
              onToggle={() => toggleExpand(index)}
            >
              <>
                <RemediatorField fieldName={`${fieldName}`} />
                <TimeoutField fieldName={`${fieldName}.timeout`} />
                <OrderField
                  fieldName={`${fieldName}.order`}
                  onChange={onOrderChanged}
                />
              </>
            </ExpandableSection>
          </FlexItem>
        </Flex>
      </WithRemoveButton>
      <Divider />
    </>
  );
};

const getExpanded = (
  remediators: Remediator[],
  expandLast?: boolean,
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
  fieldName,
}: FieldArrayRenderProps & {
  fieldName: string;
}) => {
  const [{ value: remediators }, , { setValue: setRemediators }] =
    useField<Remediator[]>(fieldName);
  const { t } = useNodeHealthCheckTranslation();

  const [expanded, setExpanded] = React.useState<Record<number, boolean>>(
    getExpanded(remediators || [], remediators?.length === 1),
  );

  const onOrderFieldChange = (id: number) => {
    const newRemediators = getSortedRemediators(remediators);
    if (!isEqual(newRemediators, remediators)) {
      setRemediators(getSortedRemediators(remediators));
      setExpanded({ ...getExpanded(remediators), [id]: true });
    }
  };

  const debounce = useDebounce(onOrderFieldChange, 300);

  const onSortDrop = (_event: DragEndEvent, newItems: DraggableObject[]) => {
    debounce.cancel();
    const newRemediators: Remediator[] = [];
    for (let idx = 0; idx < newItems.length; idx++) {
      const item = newItems[idx];
      const id = typeof item.id === "string" ? Number(item.id) : item.id;
      const r = remediators.find((x) => x.id === id);
      if (r) {
        newRemediators.push({ ...r, order: idx });
      }
    }
    setRemediators(newRemediators);
  };

  const onAdd = () => {
    const prevRemediatorOrder = remediators[remediators.length - 1]?.order;
    const newRemediator: Remediator = {
      template: getEmptyRemediationTemplate(),
      order: (prevRemediatorOrder || 0) + 1,
      id: Math.random(),
    };
    setExpanded(getExpanded([...remediators, newRemediator], true));
    push(newRemediator);
  };

  const sortableItems = remediators.map((_remediator, index) => ({
    id: _remediator.id,
    props: { useDragButton: false as const },
    content: (
      <SingleRemediatorField
        key={_remediator.id}
        index={index}
        remove={remove}
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
    ),
  }));

  return (
    <>
      <DragDropSort items={sortableItems} onDrop={onSortDrop} />
      <AddMoreButton onClick={onAdd} dataTest="add-remediator-button">
        {t("Add more")}
      </AddMoreButton>
    </>
  );
};

const RemediatorsArrayField = () => {
  const fieldName = "formData.escalatingRemediations";
  return (
    <FieldArray name={fieldName} validateOnChange={false}>
      {(props) => {
        return (
          <RemediatorsArrayFieldContent fieldName={fieldName} {...props} />
        );
      }}
    </FieldArray>
  );
};

export default RemediatorsArrayField;
